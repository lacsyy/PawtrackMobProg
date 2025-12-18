import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import { supabase } from '../supabase';

export default function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Community');
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
  const [strays, setStrays] = useState([]);
  const [filteredStrays, setFilteredStrays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const [stats, setStats] = useState({ rescues: 0, pending: 0, critical: 0, missing: 0 });

  // Form state for new stray report
  const [newStray, setNewStray] = useState({
    photo: null,
    animalType: 'dog',
    description: '',
    status: 'pending',
  });

  useEffect(() => {
    requestPermissions();
    fetchStrays();
    calculateStats();
  }, []);

  useEffect(() => {
    filterStraysByTab();
  }, [activeTab, strays]);

  const requestPermissions = async () => {
    try {
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (locationStatus === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation.coords);
      }
    } catch (error) {
      console.error('Permission error:', error);
    }
  };

  const fetchStrays = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('strays')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStrays(data || []);
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Error', 'Failed to fetch strays: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterStraysByTab = () => {
    const userType = activeTab.toLowerCase();
    const filtered = strays.filter((stray) => stray.user_type === userType);
    setFilteredStrays(filtered);
  };

  const calculateStats = async () => {
    try {
      const { data, error } = await supabase.from('strays').select('status');
      if (error) throw error;

      const statsData = {
        rescues: data.filter((s) => s.status === 'rescued').length,
        pending: data.filter((s) => s.status === 'pending').length,
        critical: data.filter((s) => s.status === 'critical').length,
        missing: data.filter((s) => s.status === 'missing').length,
      };
      setStats(statsData);
    } catch (error) {
      console.error('Stats error:', error);
    }
  };

  const openCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled) {
        setNewStray({ ...newStray, photo: result.assets[0].uri });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open camera: ' + error.message);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled) {
        setNewStray({ ...newStray, photo: result.assets[0].uri });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image: ' + error.message);
    }
  };

  const uploadPhoto = async (uri) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileName = `${Date.now()}.jpg`;
      
      // Convert base64 to blob for upload
      const response = await fetch(`data:image/jpeg;base64,${base64}`);
      const blob = await response.blob();

      const { data, error } = await supabase.storage
        .from('stray-photos')
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('stray-photos')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      throw new Error('Failed to upload photo: ' + error.message);
    }
  };

  const submitReport = async () => {
    if (!newStray.photo) {
      Alert.alert('Error', 'Please add a photo of the stray animal');
      return;
    }

    if (!newStray.description.trim()) {
      Alert.alert('Error', 'Please add a description');
      return;
    }

    if (!location) {
      Alert.alert('Error', 'Location not available. Please enable location services.');
      return;
    }

    try {
      setLoading(true);

      // Upload photo
      const photoUrl = await uploadPhoto(newStray.photo);

      // Get address from coordinates
      let address = 'Unknown location';
      try {
        const addressResult = await Location.reverseGeocodeAsync({
          latitude: location.latitude,
          longitude: location.longitude,
        });
        if (addressResult[0]) {
          address = `${addressResult[0].street || ''}, ${addressResult[0].city || ''}, ${addressResult[0].region || ''}`;
        }
      } catch (e) {
        console.error('Geocoding error:', e);
      }

      // Get current user
      const { data: userData } = await supabase.auth.getUser();

      if (!userData?.user) {
        Alert.alert('Error', 'You must be logged in to report strays');
        return;
      }

      // Insert into database
      const { error } = await supabase.from('strays').insert([
        {
          user_id: userData.user.id,
          photo_url: photoUrl,
          animal_type: newStray.animalType,
          description: newStray.description,
          location_lat: location.latitude,
          location_lng: location.longitude,
          location_address: address,
          status: newStray.status,
          user_type: activeTab.toLowerCase(),
        },
      ]);

      if (error) throw error;

      Alert.alert('Success', 'Stray animal reported successfully!');
      setModalVisible(false);
      setNewStray({
        photo: null,
        animalType: 'dog',
        description: '',
        status: 'pending',
      });
      fetchStrays();
      calculateStats();
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStrayCard = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      {item.photo_url ? (
        <Image source={{ uri: item.photo_url }} style={styles.cardImage} />
      ) : (
        <View style={[styles.cardImage, styles.noImage]}>
          <Text>No Image</Text>
        </View>
      )}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>
          {item.animal_type.toUpperCase()} - {item.status.toUpperCase()}
        </Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.cardLocation}>{item.location_address}</Text>
        <Text style={styles.cardDate}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header Tabs */}
      <View style={styles.tabContainer}>
        {['Community', 'Rescuer'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        {[
          { label: 'Rescues', value: stats.rescues },
          { label: 'Pending', value: stats.pending },
          { label: 'Critical', value: stats.critical },
          { label: 'Missing', value: stats.missing },
        ].map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* View Mode Toggle */}
      <View style={styles.viewToggle}>
        <TouchableOpacity
          style={[styles.viewButton, viewMode === 'map' && styles.activeViewButton]}
          onPress={() => setViewMode('map')}
        >
          <Text style={[styles.viewButtonText, viewMode === 'map' && styles.activeViewText]}>
            Map
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewButton, viewMode === 'list' && styles.activeViewButton]}
          onPress={() => setViewMode('list')}
        >
          <Text style={[styles.viewButtonText, viewMode === 'list' && styles.activeViewText]}>
            List
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      ) : viewMode === 'map' ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location?.latitude || 8.4542,
            longitude: location?.longitude || 124.6319,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation
        >
          {filteredStrays.map((stray) => (
            <Marker
              key={stray.id}
              coordinate={{
                latitude: stray.location_lat,
                longitude: stray.location_lng,
              }}
              pinColor={
                stray.status === 'critical'
                  ? 'red'
                  : stray.status === 'rescued'
                  ? 'green'
                  : 'orange'
              }
            >
              <Callout>
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>{stray.animal_type.toUpperCase()}</Text>
                  <Text>{stray.description}</Text>
                  <Text style={styles.calloutStatus}>Status: {stray.status}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      ) : (
        <FlatList
          data={filteredStrays}
          renderItem={renderStrayCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No strays reported yet</Text>
            </View>
          }
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Report Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Report Stray Animal</Text>

              {/* Photo Preview */}
              {newStray.photo && (
                <Image source={{ uri: newStray.photo }} style={styles.photoPreview} />
              )}

              {/* Photo Buttons */}
              <View style={styles.photoButtons}>
                <TouchableOpacity style={styles.photoButton} onPress={openCamera}>
                  <Text style={styles.photoButtonText}>📷 Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                  <Text style={styles.photoButtonText}>🖼️ Gallery</Text>
                </TouchableOpacity>
              </View>

              {/* Animal Type */}
              <Text style={styles.label}>Animal Type</Text>
              <View style={styles.animalTypeContainer}>
                {['dog', 'cat'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.animalTypeButton,
                      newStray.animalType === type && styles.selectedAnimalType,
                    ]}
                    onPress={() => setNewStray({ ...newStray, animalType: type })}
                  >
                    <Text style={styles.animalTypeText}>{type.toUpperCase()}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Status */}
              <Text style={styles.label}>Status</Text>
              <View style={styles.statusContainer}>
                {['pending', 'critical', 'rescued', 'missing'].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusButton,
                      newStray.status === status && styles.selectedStatus,
                    ]}
                    onPress={() => setNewStray({ ...newStray, status })}
                  >
                    <Text style={styles.statusText}>{status.toUpperCase()}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Description */}
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Describe the animal (color, size, behavior, etc.)"
                multiline
                numberOfLines={4}
                value={newStray.description}
                onChangeText={(text) => setNewStray({ ...newStray, description: text })}
              />

              {/* Location Info */}
              {location && (
                <Text style={styles.locationInfo}>
                  📍 Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </Text>
              )}

              {/* Buttons */}
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setModalVisible(false);
                    setNewStray({
                      photo: null,
                      animalType: 'dog',
                      description: '',
                      status: 'pending',
                    });
                  }}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.submitButton]}
                  onPress={submitReport}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Submit</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#4A90E2',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  viewToggle: {
    flexDirection: 'row',
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  viewButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  activeViewButton: {
    backgroundColor: '#4A90E2',
  },
  viewButtonText: {
    color: '#333',
  },
  activeViewText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  map: {
    flex: 1,
  },
  callout: {
    width: 200,
    padding: 10,
  },
  calloutTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  calloutStatus: {
    marginTop: 5,
    color: '#4A90E2',
  },
  listContainer: {
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  noImage: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  cardLocation: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  cardDate: {
    fontSize: 12,
    color: '#999',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  photoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  photoButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  photoButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  animalTypeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  animalTypeButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  selectedAnimalType: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  animalTypeText: {
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    margin: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedStatus: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  statusText: {
    fontSize: 12,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  locationInfo: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#999',
  },
  submitButton: {
    backgroundColor: '#4A90E2',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
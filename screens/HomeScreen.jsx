// screens/HomeScreen.jsx
import { Feather, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function HomeScreen() {
  const [role, setRole] = useState("Rescuer");

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.appTitle}>Stray Rescue</Text>
              <Text style={styles.appSubtitle}>Helping animals find safety</Text>
            </View>

            {/* ROLE SWITCH */}
            <View style={styles.roleSwitch}>
              {["Community", "Rescuer"].map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.roleChip,
                    role === item && styles.roleChipActive,
                  ]}
                  onPress={() => setRole(item)}
                >
                  <Text
                    style={[
                      styles.roleChipText,
                      role === item && styles.roleChipTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* STATS */}
          <View style={styles.statsRow}>
            {[{label:"Rescues", value:3},{label:"Pending", value:2},{label:"Critical", value:1},{label:"Missing", value:2}].map(
              (s) => (
                <View key={s.label} style={styles.statCard}>
                  <Text style={styles.statValue}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              )
            )}
          </View>
        </View>

        {/* TABS */}
        <View style={styles.tabsRow}>
          {["Report", "Map", "Missing", "Found"].map((tab, index) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabChip, tab === "Report" && styles.tabChipActive]}
            >
              <Text
                style={[
                  styles.tabChipText,
                  tab === "Report" && styles.tabChipTextActive,
                ]}
              >
                {tab}
              </Text>
              {tab === "Report" && (
                <Feather
                  name="alert-triangle"
                  size={14}
                  color="#c62828"
                  style={{ marginLeft: 4 }}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* REPORT FORM */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Report Stray Animal</Text>

          {/* ANIMAL TYPE */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Animal Type</Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.placeholder}>Select animal type</Text>
              <Ionicons name="chevron-down" size={18} color="#999" />
            </TouchableOpacity>
          </View>

          {/* CONDITION */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Condition</Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.placeholder}>Animal's condition</Text>
              <Ionicons name="chevron-down" size={18} color="#999" />
            </TouchableOpacity>
          </View>

          {/* URGENCY */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Urgency Level</Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.placeholder}>How urgent is this?</Text>
              <Ionicons name="chevron-down" size={18} color="#999" />
            </TouchableOpacity>
          </View>

          {/* DESCRIPTION */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Description</Text>
            <TextInput
              style={styles.textArea}
              multiline
              placeholder="Describe the animal's appearance, behavior, and situation..."
            />
          </View>

          {/* ACTION BUTTONS */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.secondaryBtn}>
              <Ionicons name="camera-outline" size={18} color="#333" />
              <Text style={styles.secondaryBtnText}>Add Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryBtn}>
              <Ionicons name="location-outline" size={18} color="#333" />
              <Text style={styles.secondaryBtnText}>Get Location</Text>
            </TouchableOpacity>
          </View>

          {/* SUBMIT */}
          <TouchableOpacity style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Submit Report</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

// ========================= STYLES =========================

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f7fb" },
  scroll: { paddingBottom: 40 },

  /* HEADER */
  header: {
    paddingTop: 45,
    paddingBottom: 26,
    paddingHorizontal: 20,
    backgroundColor: "#00a573",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  appTitle: { color: "#fff", fontSize: 22, fontWeight: "700" },
  appSubtitle: { color: "#e0f7fa", marginTop: 4, fontSize: 12 },

  /* ROLE SWITCH */
  roleSwitch: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    padding: 3,
  },
  roleChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  roleChipActive: {
    backgroundColor: "#fff",
  },
  roleChipText: { color: "#d4f2ea", fontSize: 12 },
  roleChipTextActive: { color: "#0aa86e", fontWeight: "700" },

  /* STATS */
  statsRow: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  statValue: { color: "#fff", fontSize: 18, fontWeight: "800" },
  statLabel: { color: "#e8f8f6", fontSize: 11, marginTop: 3 },

  /* TABS */
  tabsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  tabChip: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 8,
    alignItems: "center",
  },
  tabChipActive: {
    backgroundColor: "#0aa86e",
    borderColor: "#0aa86e",
  },
  tabChipText: {
    color: "#555",
    fontSize: 13,
  },
  tabChipTextActive: {
    color: "#fff",
    fontWeight: "700",
  },

  /* CARD */
  card: {
    backgroundColor: "#fff",
    marginTop: 14,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 14,
    color: "#333",
  },

  /* FIELDS */
  field: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
    color: "#555",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#fdfdfd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  placeholder: {
    color: "#999",
    fontSize: 13,
  },
  textArea: {
    height: 100,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    textAlignVertical: "top",
    backgroundColor: "#fdfdfd",
    fontSize: 13,
  },

  /* ACTIONS */
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    flex: 1,
    marginRight: 8,
  },
  secondaryBtnText: {
    color: "#444",
    fontSize: 13,
    marginLeft: 6,
  },

  /* SUBMIT BUTTON */
  primaryBtn: {
    backgroundColor: "#0aa86e",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});

import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import {
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { auth, db } from '../firebaseconfig';
import styles from './styles/SignupStyles';

export default function Signup() {
  const router = useRouter();
  const [role, setRole] = useState<'buyer' | 'vendor'>('buyer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleSignup = async () => {
    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      showMessage("Please enter all required fields.");
      return;
    }

    if (password.length < 6) {
      showMessage("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      showMessage("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        fullName,
        email,
        role,
        createdAt: new Date(),
      });

      showMessage("Registration successful!", true);

    } catch (err: any) {
      showMessage(err.message);
    }
  };

  // Function to show popup message
  const showMessage = (message: string, redirect: boolean = false) => {
    setPopupMessage(message);
    setShowPopup(true);

    if (Platform.OS === 'web') {
      // On web, wait for 1.5s and redirect automatically
      if (redirect) {
        setTimeout(() => {
          setShowPopup(false);
          router.replace('/');
        }, 1500);
      }
    }
  };

  const handlePopupOk = () => {
    setShowPopup(false);
    if (popupMessage === "Registration successful!") {
      router.replace('/');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>

        {/* Logo */}
        <Image
          source={require('../assets/images/agrilinklogo.png')}
          style={{ width: 150, height: 65, alignSelf: "center", marginTop: 20, marginBottom: 10 }}
        />

        <Text style={styles.logo}>AgriLink</Text>
        <Text style={styles.title}>Create your AgriLink Account</Text>

        {/* Role Selection */}
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[styles.roleButton, role === "buyer" && styles.activeRole]}
            onPress={() => setRole("buyer")}
          >
            <Text style={[styles.roleText, role === "buyer" && styles.activeRoleText]}>
              I’m a Buyer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleButton, role === "vendor" && styles.activeRole]}
            onPress={() => setRole("vendor")}
          >
            <Text style={[styles.roleText, role === "vendor" && styles.activeRoleText]}>
              I’m a Vendor
            </Text>
          </TouchableOpacity>
        </View>

        {/* Input Fields */}
        <TextInput style={styles.input} placeholder="Full Name" value={fullName} onChangeText={setFullName} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
        <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

        {/* Signup Button */}
        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <TouchableOpacity onPress={() => router.push('/')}>
          <Text style={styles.linkText}>Already have an account? Log in</Text>
        </TouchableOpacity>

        {/* Custom Popup Modal */}
        <Modal
          transparent={true}
          visible={showPopup}
          animationType="fade"
          onRequestClose={() => setShowPopup(false)}
        >
          <View style={popupStyles.modalBackground}>
            <View style={popupStyles.modalContainer}>
              <Text style={popupStyles.modalMessage}>{popupMessage}</Text>
              <Pressable style={popupStyles.okButton} onPress={handlePopupOk}>
                <Text style={popupStyles.okButtonText}>OK</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

      </View>
    </ScrollView>
  );
}

// Styles for the popup
const popupStyles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  okButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
  },
  okButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

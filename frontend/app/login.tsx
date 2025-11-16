import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import {
  ActivityIndicator,
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
import styles from './styles/LoginStyles';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const showMessage = (message: string, redirect: boolean = false) => {
    setPopupMessage(message);
    setShowPopup(true);

    if (Platform.OS === 'web' && redirect) {
      setTimeout(() => {
        setShowPopup(false);
        router.replace('/'); // redirect after delay on web
      }, 1500);
    }
  };

  const handlePopupOk = () => {
    setShowPopup(false);
    if (popupMessage === 'Login Successfully!') {
      router.replace('/'); // or buyerhome/vendorhome handled below
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showMessage('Please fill all fields.');
      return;
    }

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        showMessage('Invalid username or password.');
        return;
      }

      const userData = docSnap.data() as any;

      // Show success popup
      setPopupMessage('Login Successfully!');
      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
        if (userData.role === 'buyer') {
          router.replace('/buyerhome');
        } else {
          router.replace('/vendorhome');
        }
      }, Platform.OS === 'web' ? 1500 : 0);

    } catch (err: any) {
      showMessage('Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>

        {/* Logo */}
        <Image
          source={require('../assets/images/agrilinklogo.png')}
          style={{
            width: 150,
            height: 65,
            marginTop: 50,
            alignSelf: 'center',
            marginBottom: 10,
          }}
        />

        <Text style={styles.logo}>AgriLink</Text>
        <Text style={styles.title}>Welcome Back</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Log In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/signup')}>
          <Text style={styles.signupLink}>
            Don’t have an account? <Text style={styles.signupText}>Sign Up</Text>
          </Text>
        </TouchableOpacity>

        {/* Popup Modal */}
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

// Styles for popup modal
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

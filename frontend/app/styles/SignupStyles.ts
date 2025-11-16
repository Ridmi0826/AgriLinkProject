import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  scrollContainer: { flexGrow: 1, justifyContent: 'center' },
  container: { flex: 1, backgroundColor: '#fff', padding: 25, alignItems: 'center' },
  logo: { fontSize: 30, fontWeight: 'bold', color: '#2E7D32', marginTop: 40 },
  title: { fontSize: 18, fontWeight: '600', color: '#333', marginVertical: 10 },
  roleContainer: { flexDirection: 'row', marginVertical: 10 },
  roleButton: { borderWidth: 1, borderColor: '#4CAF50', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 25, marginHorizontal: 5 },
  activeRole: { backgroundColor: '#4CAF50' },
  roleText: { color: '#333', fontWeight: '600' },
  activeRoleText: { color: '#fff' },
  input: { width: '100%', height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 10, paddingHorizontal: 15, marginVertical: 8 },
  signupButton: { backgroundColor: '#4CAF50', borderRadius: 10, paddingVertical: 15, width: '100%', alignItems: 'center', marginTop: 10 },
  signupButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  linkText: { marginTop: 15, color: '#4CAF50' },
});

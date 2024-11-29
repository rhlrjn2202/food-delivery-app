import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:food_delivery/models/user.dart';
import 'package:food_delivery/services/auth_service.dart';

class AuthProvider with ChangeNotifier {
  User? _user;
  String? _token;
  final _storage = const FlutterSecureStorage();
  final _authService = AuthService();

  bool get isAuthenticated => _token != null;
  User? get user => _user;

  Future<void> login(String email, String password) async {
    try {
      final response = await _authService.login(email, password);
      await _storage.write(key: 'token', value: response.token);
      await _storage.write(key: 'user', value: response.user.toJson());
      
      _token = response.token;
      _user = response.user;
      notifyListeners();
    } catch (e) {
      rethrow;
    }
  }

  Future<void> signup(String name, String email, String password) async {
    try {
      final response = await _authService.signup(name, email, password);
      await _storage.write(key: 'token', value: response.token);
      await _storage.write(key: 'user', value: response.user.toJson());
      
      _token = response.token;
      _user = response.user;
      notifyListeners();
    } catch (e) {
      rethrow;
    }
  }

  Future<void> logout() async {
    await _storage.delete(key: 'token');
    await _storage.delete(key: 'user');
    _token = null;
    _user = null;
    notifyListeners();
  }

  Future<void> checkAuth() async {
    final token = await _storage.read(key: 'token');
    final userJson = await _storage.read(key: 'user');
    
    if (token != null && userJson != null) {
      _token = token;
      _user = User.fromJson(userJson);
      notifyListeners();
    }
  }
}
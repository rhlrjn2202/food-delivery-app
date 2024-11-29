import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:food_delivery/config/api_config.dart';
import 'package:food_delivery/models/order.dart';

class OrderService {
  final http.Client _client = http.Client();

  Future<Order> createOrder(OrderData orderData) async {
    try {
      final response = await _client.post(
        Uri.parse('${ApiConfig.baseUrl}/orders'),
        headers: {
          ...ApiConfig.headers,
          'Authorization': 'Bearer ${orderData.token}',
        },
        body: json.encode(orderData.toJson()),
      ).timeout(const Duration(milliseconds: ApiConfig.timeout));

      if (response.statusCode == 201) {
        return Order.fromJson(json.decode(response.body)['data']);
      }
      throw Exception('Failed to create order');
    } catch (e) {
      throw Exception('Order creation failed: $e');
    }
  }

  Future<bool> verifyPincode(String pincode) async {
    try {
      final response = await _client.get(
        Uri.parse('${ApiConfig.baseUrl}/verify-pincode/$pincode'),
        headers: ApiConfig.headers,
      ).timeout(const Duration(milliseconds: ApiConfig.timeout));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return data['available'] ?? false;
      }
      return false;
    } catch (e) {
      throw Exception('Failed to verify pincode: $e');
    }
  }
}
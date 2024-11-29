import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:food_delivery/config/api_config.dart';
import 'package:food_delivery/models/category.dart';
import 'package:food_delivery/models/product.dart';

class ApiService {
  final http.Client _client = http.Client();

  Future<List<Category>> getCategories() async {
    try {
      final response = await _client.get(
        Uri.parse('${ApiConfig.baseUrl}/categories'),
        headers: ApiConfig.headers,
      ).timeout(const Duration(milliseconds: ApiConfig.timeout));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return (data['data'] as List)
            .map((json) => Category.fromJson(json))
            .toList();
      }
      throw Exception('Failed to load categories');
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  Future<List<Product>> getProducts({String? category}) async {
    try {
      final uri = Uri.parse('${ApiConfig.baseUrl}/products')
          .replace(queryParameters: category != null ? {'category': category} : null);

      final response = await _client.get(
        uri,
        headers: ApiConfig.headers,
      ).timeout(const Duration(milliseconds: ApiConfig.timeout));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return (data['data'] as List)
            .map((json) => Product.fromJson(json))
            .toList();
      }
      throw Exception('Failed to load products');
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }
}
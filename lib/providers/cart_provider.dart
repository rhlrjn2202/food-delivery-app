import 'package:flutter/foundation.dart';
import 'package:food_delivery/models/cart_item.dart';

class CartProvider with ChangeNotifier {
  final Map<String, CartItem> _items = {};
  static const double minimumOrderValue = 200;
  static const double deliveryFee = 30;

  Map<String, CartItem> get items => {..._items};
  
  int get itemCount => _items.length;

  double get subtotal {
    return _items.values.fold(0, (sum, item) => sum + (item.price * item.quantity));
  }

  double get deliveryCharge {
    return subtotal < minimumOrderValue ? deliveryFee : 0;
  }

  double get total => subtotal + deliveryCharge;

  void addItem(String id, String name, double price) {
    if (_items.containsKey(id)) {
      _items.update(
        id,
        (existing) => CartItem(
          id: existing.id,
          name: existing.name,
          quantity: existing.quantity + 1,
          price: existing.price,
        ),
      );
    } else {
      _items.putIfAbsent(
        id,
        () => CartItem(
          id: id,
          name: name,
          quantity: 1,
          price: price,
        ),
      );
    }
    notifyListeners();
  }

  void removeItem(String id) {
    _items.remove(id);
    notifyListeners();
  }

  void clear() {
    _items.clear();
    notifyListeners();
  }
}
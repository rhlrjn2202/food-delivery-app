class OrderData {
  final String token;
  final List<OrderItem> items;
  final double subtotal;
  final double deliveryFee;
  final double total;
  final String paymentMethod;
  final CustomerDetails customerDetails;

  OrderData({
    required this.token,
    required this.items,
    required this.subtotal,
    required this.deliveryFee,
    required this.total,
    required this.paymentMethod,
    required this.customerDetails,
  });

  Map<String, dynamic> toJson() {
    return {
      'items': items.map((item) => item.toJson()).toList(),
      'subtotal': subtotal,
      'delivery_fee': deliveryFee,
      'total': total,
      'payment_method': paymentMethod,
      'customer_details': customerDetails.toJson(),
    };
  }
}

class OrderItem {
  final String id;
  final String name;
  final int quantity;
  final double price;

  OrderItem({
    required this.id,
    required this.name,
    required this.quantity,
    required this.price,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'quantity': quantity,
      'price': price,
    };
  }
}

class CustomerDetails {
  final String name;
  final String phone;
  final String email;
  final String address;
  final String pincode;

  CustomerDetails({
    required this.name,
    required this.phone,
    required this.email,
    required this.address,
    required this.pincode,
  });

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'phone': phone,
      'email': email,
      'address': address,
      'pincode': pincode,
    };
  }
}

class Order {
  final String id;
  final String status;
  final double total;
  final String createdAt;

  Order({
    required this.id,
    required this.status,
    required this.total,
    required this.createdAt,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'],
      status: json['status'],
      total: double.parse(json['total'].toString()),
      createdAt: json['created_at'],
    );
  }
}
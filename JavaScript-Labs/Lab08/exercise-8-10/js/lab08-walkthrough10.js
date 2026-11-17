/* Exercise 8.10 - Creating JavaScript objects
   Các cách tạo đối tượng ở bước 1-6 được minh họa bằng các biến riêng
   để cùng hiển thị một lúc; bước 7-11 dùng constructor function "order". */

document.write("<h3>Bước 1: new Object()</h3>");
var order1 = new Object();
order1.product = "Self Portrait in a Straw Hat";
order1.price = 15.0;
order1.quantity = 2;
order1.total = function () { return this.price * this.quantity; };
document.write("Product=" + order1.product);
document.write("<br>Price=" + order1.price);
document.write("<br>Quantity=" + order1.quantity);
document.write("<br>Total=" + order1.total());

document.write("<h3>Bước 3: bỏ cặp ngoặc () sau total</h3>");
document.write("Total=" + order1.total);        // in ra nội dung hàm, không thực thi

document.write("<h3>Bước 4-5: {} và cú pháp ngoặc vuông</h3>");
var order2 = {};
order2["product"] = "Self Portrait in a Straw Hat";
order2["price"] = 15.0;
order2["quantity"] = 2;
order2["total"] = function () { return this.price * this.quantity; };
document.write("Product=" + order2.product + " | Total=" + order2.total());

document.write("<h3>Bước 6: object literal</h3>");
var order3 = {
    product: "Self Portrait in a Straw Hat",
    price: 15.0,
    quantity: 2,
    total: function () { return this.price * this.quantity; }
};
document.write("Product=" + order3.product + " | Total=" + order3.total());

/* Bước 7-10: constructor function (có thêm phương thức output) */
function order(product, price, quantity) {
    this.product = product;
    this.price = price;
    this.quantity = quantity;
    this.total = function () { return this.price * this.quantity; },

    this.output = function () {
        document.write("<p>Product=" + this.product);
        document.write("<br>Price=" + this.price);
        document.write("<br>Quantity=" + this.quantity);
        document.write("<br>Total=" + this.total());
    }
}

/* Bước 11: tạo 2 đối tượng và gọi output() */
document.write("<h3>Bước 7-11: constructor function</h3>");
var example1 = new order("Self Portrait in a Straw Hat", 15, 2);
var example2 = new order("Untitled #23", 10, 4);

example1.output();
example2.output();

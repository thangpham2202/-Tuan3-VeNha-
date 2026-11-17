/* Exercise 8.9 - Functions as objects */

var isCanadian = true;

/* Bước 1: các hàm ban đầu
function taxRate() {
  if (isCanadian) { return 0.05; } else { return 0.0; }
}
function calculateTax(amount) {
  return amount * taxRate();
}
function calculateTotal(price, quantity) {
  return (price * quantity) + calculateTax(price * quantity);
}
*/

/* Bước 3: hàm lồng nhau (nested function)
function calculateTax(amount) {
    function taxRate() {
        if (isCanadian) { return 0.05; } else { return 0.0; }
    }
    return amount * taxRate();
}
*/

/* Bước 4-5: hàm được gán vào biến (function expression, ẩn danh)
function calculateTax(amount) {
    var tax = function () {
        if (isCanadian) { return 0.05; } else { return 0.0; }
    };
    return amount * tax();
}
*/

/* Bước 6 (phiên bản cuối): truyền hàm ẩn danh như một tham số */
function calculateTax(amount, tax) {
    return amount * tax();
}

function calculateTotal(price, quantity) {
    var amount = price * quantity;
    return amount + calculateTax(amount, function () {
        if (isCanadian) {
            return 0.05;
        } else {
            return 0.0;
        }
    });
}

const cpf = '005.418.841-58';
var cpfOnlyNumbers = cpf.replace(/\D/g, '');
console.log({ cpf, cpfOnlyNumbers });
let total = 1;

for (let index = 0; index < cpf.length; index++) {
  if (index % 2 === 0) {
    total = total + cpf.charCodeAt(index);
  } else {
    total = total * cpf.charCodeAt(index);
  }
  console.log({ total });
}

// total = total * total * total;
console.log({ total });

total = total.toString();

email_token_verification = total.substring(total.length - 6);
console.log({ email_token_verification });

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home-component',
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.css']
})
export class HomeComponentComponent implements OnInit {
  constructor(private http: HttpClient, private authService:AuthService,private userService:UserService) {}
  persons :{id:String,name:String}[] = [];
  items = [
    { name: 'Lahmacun', price: 130 },
    { name: 'Ayran', price: 45 },
    { name: 'Tatlı', price: 30 },
    { name: "Bahşiş", price: 1 },
    { name: 'Çorba', price: 80 },
    { name: 'Antep Lahmacun', price: 150 },
    { name: 'Su', price: 15 },
    { name: 'Cola', price: 55 },
    { name: 'Içli Köfte', price: 90 }
  ];

  selectedPerson: any;
  selectedItem: any;
  quantity: number = 1; // Minimum quantity 1, default to 1
  orders: any[] = [];
  totalPrice: number = 0;
  summaryByPerson: any[] = [];
  personTotals: any[] = []; // New array to hold totals by person

  ngOnInit() {
    // Set the first person and item as selected by default
     this.userService.getUsers().subscribe({next:data => {
      if(data.success){
       const users = data.users
       users.forEach((user:any) => {
        let usersName = user.name;
        let usersId = user._id
        this.persons.push({ id : usersId ,name:usersName})
       });
       if(this.persons.length >0) {
        this.selectedPerson = this.persons[0].id;
        this.selectedItem = this.items[0];
       }
      }
    }});
    
    this.selectedPerson = this.persons[0];
    this.selectedItem = this.items[0];
  }

  saveDB() {
    // Prepare user data to send
    const usersData = this.persons.map(person => {
      const personOrders = this.orders.filter(order => order.person === person);

      const food = {
        lahmacun: personOrders.filter(o => o.name === 'Lahmacun').reduce((sum, o) => sum + o.quantity, 0),
        ayran: personOrders.filter(o => o.name === 'Ayran').reduce((sum, o) => sum + o.quantity, 0),
        tatli: personOrders.filter(o => o.name === 'Tatlı').reduce((sum, o) => sum + o.quantity, 0),
        corba: personOrders.filter(o => o.name === 'Çorba').reduce((sum, o) => sum + o.quantity, 0),
        AntepLahmacun: personOrders.filter(o => o.name === 'Antep Lahmacun').reduce((sum, o) => sum + o.quantity, 0),
        su: personOrders.filter(o => o.name === 'Su').reduce((sum, o) => sum + o.quantity, 0),
        Cola: personOrders.filter(o => o.name === 'Cola').reduce((sum, o) => sum + o.quantity, 0),
        bahsis: personOrders.filter(o => o.name === 'Bahşiş').reduce((sum, o) => sum + o.quantity, 0)
      };

      return { name: person.name, userId:person.id, food };
    });

    this.http.post('http://localhost:3000/statistic/save', usersData)
      .subscribe(response => {
        console.log('Response from server:', response);
        alert('Veri tabanına başarıyla kaydedildi.')
      }, error => {
        console.error('Error:', error);
      });
  }

  onItemSelect() {
    if (this.selectedItem) {
      this.quantity = 1; // Reset quantity to 1 when a new item is selected
    }
  }

  addItem() {
    if (this.selectedPerson && this.selectedItem && this.quantity > 0) {
      const existingOrderIndex = this.orders.findIndex(order =>
        order.person === this.selectedPerson && order.name === this.selectedItem.name
      );

      if (existingOrderIndex !== -1) {
        // Update existing order
        this.orders[existingOrderIndex].quantity += this.quantity;
        this.orders[existingOrderIndex].price = this.orders[existingOrderIndex].quantity * this.selectedItem.price;
      } else {
        // Add new order
        const order = {
          person: this.selectedPerson,
          name: this.selectedItem.name,
          quantity: this.quantity,
          price: this.selectedItem.price * this.quantity
        };
        this.orders.push(order);
      }

      this.calculateTotalPrice();
      this.calculateSummaryByPerson();
      this.calculatePersonTotals(); // Calculate totals by person
      this.resetItemForm(); // Reset only quantity
    } else {
      alert('Please select a person, an item, and enter a valid quantity');
    }
  }

  decreaseQuantity(person: string, itemName: string) {
    const orderIndex = this.orders.findIndex(order =>
      order.person === person && order.name === itemName
    );

    if (orderIndex !== -1) {
      if (this.orders[orderIndex].quantity > 1) {
        // Decrease quantity
        this.orders[orderIndex].quantity -= 1;
        this.orders[orderIndex].price = this.orders[orderIndex].quantity * this.items.find(item => item.name === itemName)!.price;
      } else {
        // Remove item if quantity is 1
        this.orders.splice(orderIndex, 1);
      }

      this.calculateTotalPrice();
      this.calculateSummaryByPerson();
      this.calculatePersonTotals();
    }
  }

  removeItem(person: string, itemName: string) {
    this.orders = this.orders.filter(order => !(order.person === person && order.name === itemName));

    this.calculateTotalPrice();
    this.calculateSummaryByPerson();
    this.calculatePersonTotals();
  }

  calculateTotalPrice() {
    this.totalPrice = this.orders.reduce((acc, order) => acc + order.price, 0);
  }

  calculateSummaryByPerson() {
    const summaryMap = new Map();

    this.orders.forEach(order => {
      if (summaryMap.has(order.person)) {
        summaryMap.get(order.person).orders.push(order);
      } else {
        summaryMap.set(order.person, { person: order.person, orders: [order] });
      }
    });

    this.summaryByPerson = Array.from(summaryMap.values());
  }

  calculatePersonTotals() {
    const totalsMap = new Map();

    this.orders.forEach(order => {
      if (totalsMap.has(order.person)) {
        totalsMap.get(order.person).totalPrice += order.price;
      } else {
        totalsMap.set(order.person, { person: order.person, totalPrice: order.price });
      }
    });

    this.personTotals = Array.from(totalsMap.values());
  }

  resetItemForm() {
    this.quantity = 1; // Reset quantity to default value for the next item
    // Keep selected item and person
  }

  resetOrder() {
    this.orders = [];
    this.totalPrice = 0;
    this.summaryByPerson = [];
    this.personTotals = []; // Reset person totals
    // Keep selected item and person
    this.quantity = 1; // Reset quantity to default value
  }
}

AFRAME.registerComponent("markerhandler", {
    init: async function() {
      this.el.addEventListener("markerFound", () => {
        console.log("marker is found");
        this.handleMarkerFound();
      });
  
      this.el.addEventListener("markerLost", () => {
        console.log("marker is lost");
        this.handleMarkerLost();
      });
    },


handleMarkerFound: function() {
    var buttonDiv = document.getElementById("button-div");
    buttonDiv.style.display = "flex";

    var orderButtton = document.getElementById("order-button");
    var orderSummaryButtton = document.getElementById("order-summary-button");


    orderButtton.addEventListener("click", () => {
      swal({
        icon: "https://i.imgur.com/4NZ6uLY.jpg",
        title: "Thanks For Order !",
        text: "  ",
        timer: 2000,
        buttons: false
      });
    });

    orderSummaryButtton.addEventListener("click", () => {
      swal({
        icon: "warning",
        title: "Order Summary",
        text: "Work In Progress"
      });
    });
  },

  handleOrder: function(uid, toy) {
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .get()
      .then(doc => {
        var details = doc.data();

        if (details["current_orders"][toy.id]) {
          details["current_orders"][toy.id]["quantity"] += 1;
          var currentQuantity = details["current_orders"][toy.id]["quantity"];
          details["current_orders"][toy.id]["subtotal"] = 
           currentQuantity * toy.price;
        } else {
          details["current_orders"][toy.id] = {
            item:  toy.toy_name,
            price: toy.price,
            quantity: 1,
            subtotal: toy.price * 1
          };
        }

        details.total_bill += toy.price;
        firebase
          .firestore()
          .collection("users")
          .doc(doc.id)
          .update(details);
      });
  },

  getToys: async function() {
    return await firebase
      .firestore()
      .collection("toys")
      .get()
      .then(snap => {
        return snap.docs.map(doc => doc.data());
      });
  },

  handleMarkerLost: function() {
    var buttonDiv = document.getElementById("button-div");
    buttonDiv.style.display = "none";
  }
});

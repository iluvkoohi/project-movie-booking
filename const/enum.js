const accountTypes = ["customer", "merchant", "rider", "organizer"];
const checkoutStatus = ["to-pack", "packed", "to-deliver", "delivered"];
const riderStatus = ["active", "inactive"];
const messageTypes = ["billing", "message", "news"];
const eventTypes = ["wedding", "kids-birthday-party", "adults-birthday-party", "disco", "casual-party"];
const eventStatus = ["preparing", "in-progress", "completed", "cancelled"];

const paymentMethod = ["e-wallet", "cash"];
const paymentStatus = ["unpaid", "paid"];
const deliveryType = ["pickup", "deliver"];

const orderStatus = ["pending", "in-progress", "completed", "cancelled"];

const userRoles = ["customer", "artist", "admin"];

module.exports = {
    accountTypes,
    checkoutStatus,
    riderStatus,
    messageTypes,
    userRoles,
    eventTypes,
    eventStatus,
    paymentMethod,
    paymentStatus,
    deliveryType,
    orderStatus
};

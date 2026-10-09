// ============================================================
// RIDEON - BOOKING SYSTEM
// js/booking.js
// ============================================================


// ============================================================
// GET VEHICLES
// ============================================================

async function getVehicles() {

    const {
        data,
        error
    } = await supabaseClient
        .from("vehicles")
        .select("*")
        .eq("available", true)
        .order("id", {
            ascending: true
        });

    if (error) {

        console.error(
            "Vehicle Error:",
            error
        );

        return [];
    }

    return data;
}


// ============================================================
// GET SINGLE VEHICLE
// ============================================================

async function getVehicle(vehicleId) {

    const {
        data,
        error
    } = await supabaseClient
        .from("vehicles")
        .select("*")
        .eq("id", vehicleId)
        .single();

    if (error) {

        console.error(
            "Vehicle Error:",
            error
        );

        return null;
    }

    return data;
}


// ============================================================
// DISPLAY VEHICLES
// ============================================================

async function loadVehicles() {

    const container =
        document.getElementById("vehicleContainer");

    if (!container) {
        return;
    }

    container.innerHTML =
        "<p>Loading vehicles...</p>";

    const vehicles = await getVehicles();

    if (!vehicles.length) {

        container.innerHTML =
            "<p>No vehicles available.</p>";

        return;
    }

    container.innerHTML = "";

    vehicles.forEach(vehicle => {

        const card =
            document.createElement("div");

        card.className =
            "vehicle-card";

        card.innerHTML = `

            <img
                src="${vehicle.image_url}"
                alt="${vehicle.vehicle_name}"
            >

            <h3>
                ${vehicle.vehicle_name}
            </h3>

            <p>
                ${vehicle.brand || ""}
                ${vehicle.model || ""}
            </p>

            <p>
                Type:
                ${vehicle.vehicle_type}
            </p>

            <p>
                Fuel:
                ${vehicle.fuel_type || "N/A"}
            </p>

            <p>
                Seats:
                ${vehicle.seats || "N/A"}
            </p>

            <h4>
                ₹${vehicle.price_per_day}
                / day
            </h4>

            <p>
                ${vehicle.description || ""}
            </p>

            <button
                onclick="goToBooking(${vehicle.id})"
            >
                Book Now
            </button>
        `;

        container.appendChild(card);

    });
}


// ============================================================
// GO TO BOOKING PAGE
// ============================================================

function goToBooking(vehicleId) {

    window.location.href =
        `booking.html?vehicle_id=${vehicleId}`;
}


// ============================================================
// LOAD SELECTED VEHICLE
// ============================================================

async function loadBookingVehicle() {

    const vehicleId =
        new URLSearchParams(
            window.location.search
        ).get("vehicle_id");

    if (!vehicleId) {
        return;
    }

    const vehicle =
        await getVehicle(vehicleId);

    if (!vehicle) {

        alert("Vehicle not found.");

        return;
    }

    const nameElement =
        document.getElementById("vehicleName");

    const priceElement =
        document.getElementById("pricePerDay");

    const imageElement =
        document.getElementById("vehicleImage");

    const vehicleIdElement =
        document.getElementById("vehicleId");

    if (nameElement) {

        nameElement.textContent =
            vehicle.vehicle_name;
    }

    if (priceElement) {

        priceElement.textContent =
            `₹${vehicle.price_per_day} / day`;
    }

    if (imageElement) {

        imageElement.src =
            vehicle.image_url;

        imageElement.alt =
            vehicle.vehicle_name;
    }

    if (vehicleIdElement) {

        vehicleIdElement.value =
            vehicle.id;
    }

    window.selectedVehicle =
        vehicle;

    calculateBookingAmount();
}


// ============================================================
// CALCULATE DURATION
// ============================================================

function calculateDuration() {

    const pickupDate =
        document.getElementById("pickupDate")?.value;

    const returnDate =
        document.getElementById("returnDate")?.value;

    if (!pickupDate || !returnDate) {

        return 0;
    }

    const start =
        new Date(pickupDate);

    const end =
        new Date(returnDate);

    if (end < start) {

        return 0;
    }

    const difference =
        end.getTime() -
        start.getTime();

    const days =
        Math.ceil(
            difference /
            (1000 * 60 * 60 * 24)
        );

    // Same day = 1 day
    return days === 0 ? 1 : days;
}


// ============================================================
// CALCULATE TOTAL
// ============================================================

function calculateBookingAmount() {

    const duration =
        calculateDuration();

    const vehicle =
        window.selectedVehicle;

    if (!vehicle) {
        return;
    }

    const total =
        duration *
        Number(vehicle.price_per_day);

    const durationElement =
        document.getElementById("duration");

    const totalElement =
        document.getElementById("totalAmount");

    if (durationElement) {

        durationElement.value =
            duration > 0
                ? duration
                : "";
    }

    if (totalElement) {

        totalElement.textContent =
            duration > 0
                ? `₹${total.toFixed(2)}`
                : "₹0.00";
    }
}


// ============================================================
// CREATE BOOKING
// ============================================================

async function createBooking() {

    const user =
        await requireLogin();

    if (!user) {
        return;
    }

    const vehicleId =
        document.getElementById("vehicleId")?.value;

    const pickupLocation =
        document.getElementById("pickupLocation")?.value.trim();

    const pickupDate =
        document.getElementById("pickupDate")?.value;

    const returnDate =
        document.getElementById("returnDate")?.value;

    const customerNote =
        document.getElementById("customerNote")?.value.trim();

    if (
        !vehicleId ||
        !pickupLocation ||
        !pickupDate ||
        !returnDate
    ) {

        alert(
            "Please fill all required fields."
        );

        return;
    }

    const duration =
        calculateDuration();

    if (duration <= 0) {

        alert(
            "Return date must be after pickup date."
        );

        return;
    }

    const vehicle =
        await getVehicle(vehicleId);

    if (!vehicle) {

        alert("Vehicle not found.");

        return;
    }

    if (!vehicle.available) {

        alert(
            "This vehicle is currently unavailable."
        );

        return;
    }

    const pricePerDay =
        Number(vehicle.price_per_day);

    const totalAmount =
        duration * pricePerDay;

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("bookings")
            .insert({

                user_id: user.id,

                vehicle_id:
                    Number(vehicleId),

                pickup_location:
                    pickupLocation,

                pickup_date:
                    pickupDate,

                return_date:
                    returnDate,

                duration:
                    duration,

                price_per_day:
                    pricePerDay,

                total_amount:
                    totalAmount,

                booking_status:
                    "pending",

                payment_status:
                    "pending",

                customer_note:
                    customerNote || null

            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        alert(
            "Booking created successfully!"
        );

        window.location.href =
            "my-bookings.html";

    } catch (error) {

        console.error(
            "Booking Error:",
            error
        );

        alert(
            "Booking failed: " +
            error.message
        );
    }
}


// ============================================================
// LOAD USER BOOKINGS
// ============================================================

async function loadMyBookings() {

    const user =
        await requireLogin();

    if (!user) {
        return;
    }

    const container =
        document.getElementById("bookingContainer");

    if (!container) {
        return;
    }

    container.innerHTML =
        "<p>Loading bookings...</p>";

    const {
        data,
        error
    } = await supabaseClient
        .from("bookings")
        .select(`
            *,
            vehicles (
                vehicle_name,
                vehicle_type,
                brand,
                model,
                image_url
            )
        `)
        .eq("user_id", user.id)
        .order("created_at", {
            ascending: false
        });

    if (error) {

        console.error(
            "Booking Load Error:",
            error
        );

        container.innerHTML =
            "<p>Unable to load bookings.</p>";

        return;
    }

    if (!data.length) {

        container.innerHTML =
            "<p>No bookings found.</p>";

        return;
    }

    container.innerHTML = "";

    data.forEach(booking => {

        const card =
            document.createElement("div");

        card.className =
            "booking-card";

        const vehicle =
            booking.vehicles;

        card.innerHTML = `

            <img
                src="${vehicle?.image_url || ""}"
                alt="${vehicle?.vehicle_name || "Vehicle"}"
            >

            <h3>
                ${vehicle?.vehicle_name || "Vehicle"}
            </h3>

            <p>
                Type:
                ${vehicle?.vehicle_type || "N/A"}
            </p>

            <p>
                Pickup:
                ${booking.pickup_location}
            </p>

            <p>
                Pickup Date:
                ${booking.pickup_date}
            </p>

            <p>
                Return Date:
                ${booking.return_date}
            </p>

            <p>
                Duration:
                ${booking.duration} day(s)
            </p>

            <p>
                Price:
                ₹${booking.price_per_day}
                / day
            </p>

            <h4>
                Total:
                ₹${booking.total_amount}
            </h4>

            <p>
                Booking Status:
                <strong>
                    ${booking.booking_status}
                </strong>
            </p>

            <p>
                Payment:
                <strong>
                    ${booking.payment_status}
                </strong>
            </p>

            ${
                booking.booking_status === "pending" ||
                booking.booking_status === "confirmed"
                ?
                `
                <button
                    onclick="cancelBooking(${booking.id})"
                >
                    Cancel Booking
                </button>
                `
                :
                ""
            }

        `;

        container.appendChild(card);

    });
}


// ============================================================
// CANCEL BOOKING
// ============================================================

async function cancelBooking(bookingId) {

    const user =
        await requireLogin();

    if (!user) {
        return;
    }

    const confirmation =
        confirm(
            "Are you sure you want to cancel this booking?"
        );

    if (!confirmation) {
        return;
    }

    const {
        error
    } = await supabaseClient
        .from("bookings")
        .update({
            booking_status: "cancelled"
        })
        .eq("id", bookingId)
        .eq("user_id", user.id);

    if (error) {

        console.error(
            "Cancel Error:",
            error
        );

        alert(
            "Unable to cancel booking."
        );

        return;
    }

    alert(
        "Booking cancelled successfully."
    );

    loadMyBookings();
}


// ============================================================
// AUTO CALCULATE WHEN DATE CHANGES
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const pickupDate =
            document.getElementById("pickupDate");

        const returnDate =
            document.getElementById("returnDate");

        if (pickupDate) {

            pickupDate.addEventListener(
                "change",
                calculateBookingAmount
            );
        }

        if (returnDate) {

            returnDate.addEventListener(
                "change",
                calculateBookingAmount
            );
        }

    }
);
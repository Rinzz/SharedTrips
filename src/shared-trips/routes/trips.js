const { Router } = require("express");
const {
  getUserStatus,
  verifyAuthAccess,
  verifyIsCreator,
} = require("../handlers/auth");
const {
  getAllTrips,
  offerTrip,
  getTrip,
  joinTrip,
  closeTrip,
} = require("../handlers/trips");
const trip = require("../models/trip");

const router = Router();

router.get(
  "/shared-trips",
  getUserStatus,
  verifyAuthAccess,
  getAllTrips,
  (req, res) => {
    res.render("trips/sharedTrips", {
      isLoggedIn: req.isLoggedIn,
      userEmail: req.user.email,
      trips: req.trips,
    });
  }
);

router.get("/offer-trip", getUserStatus, (req, res) => {
  res.render("trips/offerTrip", {
    isLoggedIn: req.isLoggedIn,
    userEmail: req.user.email,
  });
});

router.post("/offer-trip", getUserStatus, (req, res) => {
  offerTrip(req, res);
  res.redirect("/shared-trips");
});

router.get(
  "/trip-details/:id",
  getUserStatus,
  verifyAuthAccess,
  getTrip,
  (req, res) => {
    const buddies = req.trip.buddies.reduce((a, b) => {
      return a.concat(b.email);
    }, []);
    res.render("trips/detailsTrip", {
      isLoggedIn: req.isLoggedIn,
      userEmail: req.user.email,
      ...req.trip,
      creator: req.creator.email,
      isCreator: req.user._id.toString() === req.trip.creator.toString(),
      seatsAvaible: req.trip.seats > 0,
      buddies: buddies.join(", "),
      alreadyJoin: buddies.includes(req.user.email),
    });
  }
);

router.get(
  "/join-trip/:id",
  getUserStatus,
  verifyAuthAccess,
  getTrip,
  async (req, res) => {
    await joinTrip(req.trip._id, req.user._id, req.trip.seats);
    res.redirect(`/trip-details/${req.trip._id}`);
  }
);

router.get(
  "/close-trip/:id",
  getUserStatus,
  verifyAuthAccess,
  getTrip,
  verifyIsCreator,
  async (req, res) => {
    if (req.isCreator) {
      await closeTrip(req.trip._id);
      return res.redirect("/shared-trips");
    }

    res.render("404", {
      isLoggedIn: req.isLoggedIn,
      userEmail: req.user.email,
    });
  }
);
module.exports = router;

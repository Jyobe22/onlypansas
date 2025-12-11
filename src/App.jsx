import React, { useState, useEffect } from "react";
import "./App.css";
import { supabase } from "./supabaseClient";


function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [profileData, setProfileData] = useState({
    gender: "",
    interested: "",
    city: "",
    state: "",
  });
  const [userId, setUserId] = useState(null);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
   useEffect(() => {
    // Only try to load when we have a user and we're on the profile page
    if (!userId || currentPage !== "profile") return;

    const loadProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("gender, interested, city, state")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Error loading profile:", error);
          return;
        }

        if (data) {
          setProfileData({
            gender: data.gender || "",
            interested: data.interested || "",
            city: data.city || "",
            state: data.state || "",
          });
        }
      } catch (err) {
        console.error("Unexpected error loading profile:", err);
      }
    };

    loadProfile();
  }, [userId, currentPage]);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      // 1) Check current session (user stays logged in across refresh)
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error);
        return;
      }

      if (session && session.user && mounted) {
        setUserId(session.user.id);

        // If we're sitting on the home page, send them to matches
        setCurrentPage((prev) => (prev === "home" ? "matches" : prev));
      }

      // 2) Listen for future auth changes (login / logout)
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, newSession) => {
        if (!mounted) return;

        if (newSession && newSession.user) {
          setUserId(newSession.user.id);
          setCurrentPage((prev) =>
            prev === "home" || prev === "login" ? "matches" : prev
          );
        } else {
          // logged out
          setUserId(null);
          setCurrentPage("home");
        }
      });

      // Cleanup on unmount
      return () => {
        subscription.unsubscribe();
      };
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const handleLoginChange = (field, value) => {
    setLoginData((prev) => ({ ...prev, [field]: value }));
  };
 const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Error signing out:", err);
    }

    setUserId(null);
    setLoginData({ email: "", password: "" });
    // optional: clear signup/profile if you want
    // setSignupData({ name: "", email: "", password: "" });
    // setProfileData({ gender: "", interested: "", city: "", state: "" });

    setCurrentPage("home");
  };


  const handleSignupChange = (field, value) => {
    setSignupData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfileChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="page">
      <header className="header">
  <div className="header-actions">
   
  </div>
  <header className="header">
  <div className="logo">...</div>

  <div className="header-center">
    <button className="btn btn-merch" onClick={() => setCurrentPage("merch")}>
      Merch
    </button>
  </div>

   <div className="header-actions">
    {userId ? (
      <>
        <button
          className="btn btn-ghost"
          onClick={() => setCurrentPage("matches")}
        >
          Matches
        </button>
        <button className="btn btn-ghost" onClick={handleLogout}>
          Log out
        </button>
      </>
    ) : (
      <>
        <button
          className="btn btn-ghost"
          onClick={() => setCurrentPage("login")}
        >
          Log in
        </button>
        <button
          className="btn btn-primary"
          onClick={() => setCurrentPage("signup")}
        >
          Join free
        </button>
      </>
    )}
  </div>

</header>


</header>

      <main
        className={
          currentPage === "home" ? "main" : "main main-single"
        }
      >{currentPage === "merch" && (
  <MerchScreen onBackHome={() => setCurrentPage("home")} />
)}

        {currentPage === "home" && (
          <>
            {/* LEFT: HERO COPY */}
            <section>
              <div className="badge">
                <span className="badge-dot" />
                Real people, real curves, real dates
              </div>
              <h1>
                Dating for people who{" "}
                <span className="accent">
                  love heavy-set partners
                </span>
                .
              </h1>
              <p className="hero-sub">
                OnlyPansas is a body-positive dating community for men and
                women who are into fuller figures, softer edges, and real
                connection with members of the opposite sex. No judgment, no
                shame—just appreciation.
              </p>

              <div className="hero-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => setCurrentPage("signup")}
                >
                  Get started – it’s free
                </button>
                <button className="btn btn-ghost">
                  How OnlyPansas works
                </button>
              </div>

              <p className="hero-note">
                🔒 Discreet profiles, simple matching, and clear respect rules
                for every member.
              </p>

              <div className="pill-row">
                <div className="pill pill-accent">
                  Body-positive community
                </div>
                <div className="pill">
                  Match by preferences &amp; vibe
                </div>
                <div className="pill">
                  Opposite-sex dating only (for now)
                </div>
              </div>
            </section>

            {/* RIGHT: MATCH PREVIEW CARD */}
            <aside
              className="card"
              aria-label="Preview of OnlyPansas match interface"
            >
              <div className="card-header">
                <div className="card-title">
                  <span className="status-dot" /> 124 people nearby love
                  plus-size partners
                </div>
                <span className="card-tag">Sample Match</span>
              </div>

              <div className="profiles">
                <div className="profile-row">
                  <div className="avatar">M</div>
                  <div className="profile-meta">
                    <div className="profile-name">María · 31</div>
                    <div className="profile-sub">
                      “Soft, silly, and proud of my curves.”
                    </div>
                  </div>
                  <span className="profile-pill">
                    Curvy &amp; confident
                  </span>
                </div>

                <div className="profile-row">
                  <div className="avatar blue">A</div>
                  <div className="profile-meta">
                    <div className="profile-name">Alex · 34</div>
                    <div className="profile-sub">
                      Into thick thighs, good food &amp; bad jokes.
                    </div>
                  </div>
                  <span className="profile-pill">
                    Seeking plus-size women
                  </span>
                </div>
              </div>

              <div className="match-meter">
                <span>Potential match score</span>
                <div className="meter-bar">
                  <div className="meter-fill" />
                </div>
                <span>78%</span>
              </div>

              <div className="card-footer">
                <div className="card-badges">
                  <span className="card-badge">
                    Curvy &amp; heavy-set friendly
                  </span>
                  <span className="card-badge">Local only</span>
                </div>
                <button className="card-cta">
                  See more matches →
                </button>
              </div>
            </aside>
          </>
        )}
{currentPage === "login" && (
  <LoginForm
    loginData={loginData}
    onChange={handleLoginChange}
    onBackHome={() => setCurrentPage("home")}
    onLoggedIn={(loggedInUserId) => {
      setUserId(loggedInUserId);
      setCurrentPage("profile"); // send them to profile after login
    }}
  />
)}

        {currentPage === "signup" && (
  <SignupForm
    signupData={signupData}
    onChange={handleSignupChange}
    onBackHome={() => setCurrentPage("home")}
    onContinue={(newUserId) => {
      setUserId(newUserId);
      setCurrentPage("profile");
    }}
  />
)}

{currentPage === "profile" && (
  <ProfileForm
    profileData={profileData}
    onChange={handleProfileChange}
    onBack={() => setCurrentPage("signup")}
    onComplete={() => setCurrentPage("success")}
    userId={userId}
  />
)}


        {currentPage === "success" && (
          <SuccessScreen
            signupData={signupData}
            profileData={profileData}
            onGoHome={() => setCurrentPage("home")}
          />
        )}
      </main>

      {currentPage === "home" && (
        <section className="sections" aria-label="How OnlyPansas works">
          <div className="section-card">
            <h2 className="section-title">1. Share what you love</h2>
            <p className="section-text">
              Create a profile that actually says what you’re into: body type,
              personality, date vibes, and deal-breakers. Everyone here is
              already into heavy-set partners, so you can skip the awkward
              explanations.
            </p>
          </div>

          <div className="section-card">
            <h2 className="section-title">
              2. Match with mutual interest
            </h2>
            <p className="section-text">
              OnlyPansas matches you with members of the opposite sex who are
              into the same kind of body, chemistry, and connection you are.
              If the interest is mutual, you can chat.
            </p>
          </div>

          <div className="section-card">
            <h2 className="section-title">
              3. Keep it respectful &amp; real
            </h2>
            <p className="section-text">
              We’re big on consent, kindness, and body respect. Clear
              community rules and simple tools let you report bad behavior,
              block people, and stay in control of your experience.
            </p>
          </div>
        </section>
      )}

           <footer className="footer">
        <div>© {new Date().getFullYear()} OnlyPansas. All rights reserved.</div>
        <div className="footer-links">
          <a href="#">Safety &amp; respect</a>
          <a href="#">FAQ</a>
          <a href="#">Contact</a>
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
        </div>
      </footer>
    </div>
  );
}

/* LOGIN FORM COMPONENT */
function LoginForm({ loginData, onChange, onBackHome, onLoggedIn }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { email, password } = loginData;

      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      const loggedInUserId = data?.user?.id;

      if (!loggedInUserId) {
        setError("Could not get user id after login.");
        setLoading(false);
        return;
      }

      setLoading(false);
      onLoggedIn(loggedInUserId);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <section className="form-card">
      <button
        type="button"
        className="back-link"
        onClick={onBackHome}
      >
        ← Back to home
      </button>
      <h2 className="form-title">Log in to OnlyPansas</h2>
      <p className="form-description">
        Welcome back. Enter your email and password to continue.
      </p>

      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            className="input"
            type="email"
            value={loginData.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            className="input"
            type="password"
            value={loginData.password}
            onChange={(e) => onChange("password", e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary form-primary"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </div>
      </form>
    </section>
  );
}

/* SIGNUP FORM COMPONENT */
function SignupForm({ signupData, onChange, onBackHome, onContinue }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { email, password } = signupData;

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      // data.user contains the user object with id
      const newUserId = data?.user?.id;

      if (!newUserId) {
        setError("Could not get user id after signup.");
        setLoading(false);
        return;
      }

      setLoading(false);
      onContinue(newUserId); // pass id up to App
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <section className="form-card">
      <button
        type="button"
        className="back-link"
        onClick={onBackHome}
      >
        ← Back to home
      </button>
      <h2 className="form-title">Create your OnlyPansas account</h2>
      <p className="form-description">
        Start with the basics. You can adjust details later in your
        profile.
      </p>

      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            className="input"
            type="text"
            value={signupData.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="María"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className="input"
            type="email"
            value={signupData.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            className="input"
            type="password"
            value={signupData.password}
            onChange={(e) => onChange("password", e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary form-primary"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Continue to profile"}
          </button>
          <p className="form-footnote">
            By continuing, you agree to our Terms &amp; Privacy Policy.
          </p>
        </div>
      </form>
    </section>
  );
}

function MerchScreen({ onBackHome }) {
  return (
    <section className="form-card">
      <button type="button" className="back-link" onClick={onBackHome}>
        ← Back to home
      </button>

      <h2 className="form-title">OnlyPansas Merch</h2>
      <p className="form-description">
        Made to order. Secure checkout powered by Shopify.
      </p>

      {/* Shopify Buy Button mounts into this div */}
      <div id="collection-component-1765044195666" />

      <ShopifyCollectionEmbed />
    </section>
  );
}

function ShopifyCollectionEmbed() {
  React.useEffect(() => {
    const mountId = "collection-component-1765044195666";
    const mountNode = document.getElementById(mountId);

    if (!mountNode) return;

    // If it already rendered once, don't re-initialize (prevents duplicates on navigation/hot reload)
    if (mountNode.dataset.shopifyInitialized === "true") return;
    mountNode.dataset.shopifyInitialized = "true";

    const scriptURL =
      "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";

    function ShopifyBuyInit() {
      // ShopifyBuy should now exist
      if (!window.ShopifyBuy || !window.ShopifyBuy.UI) return;

      const client = window.ShopifyBuy.buildClient({
        domain: "igsjjc-di.myshopify.com",
        storefrontAccessToken: "9883db782c8657edbecbfca1e09a0628",
      });

      window.ShopifyBuy.UI.onReady(client).then(function (ui) {
        ui.createComponent("collection", {
          id: "323323330759",
          node: document.getElementById(mountId),
          moneyFormat: "%24%7B%7Bamount%7D%7D",
          options: {
            product: {
              styles: {
                product: {
                  "@media (min-width: 601px)": {
                    "max-width": "calc(33.33333% - 30px)",
                    "margin-left": "30px",
                    "margin-bottom": "50px",
                    width: "calc(33.33333% - 30px)",
                  },
                  img: {
                    height: "calc(100% - 15px)",
                    position: "absolute",
                    left: "0",
                    right: "0",
                    top: "0",
                  },
                  imgWrapper: {
                    "padding-top": "calc(75% + 15px)",
                    position: "relative",
                    height: "0",
                  },
                },
              },
              text: { button: "Add to cart" },
            },
            productSet: {
              styles: {
                products: {
                  "@media (min-width: 601px)": {
                    "margin-left": "-30px",
                  },
                },
              },
            },
            modalProduct: {
              contents: {
                img: false,
                imgWithCarousel: true,
                button: false,
                buttonWithQuantity: true,
              },
              styles: {
                product: {
                  "@media (min-width: 601px)": {
                    "max-width": "100%",
                    "margin-left": "0px",
                    "margin-bottom": "0px",
                  },
                },
              },
              text: { button: "Add to cart" },
            },
            option: {},
            cart: {
              text: { total: "Subtotal", button: "Checkout" },
            },
            toggle: {},
          },
        });
      });
    }

    function loadScript() {
      // If script already exists, just init
      if (document.getElementById("shopify-buy-button-sdk")) {
        ShopifyBuyInit();
        return;
      }

      const script = document.createElement("script");
      script.id = "shopify-buy-button-sdk";
      script.async = true;
      script.src = scriptURL;
      script.onload = ShopifyBuyInit;
      document.head.appendChild(script);
    }

    // If ShopifyBuy already loaded, init; otherwise load script
    if (window.ShopifyBuy && window.ShopifyBuy.UI) {
      ShopifyBuyInit();
    } else {
      loadScript();
    }
  }, []);

  return null;
}

/* PROFILE FORM COMPONENT */
function ProfileForm({ profileData, onChange, onBack, onComplete, userId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!userId) {
        setError("You must be logged in to save your profile.");
        setLoading(false);
        return;
      }

      const { gender, interested, city, state } = profileData;

      const { error: upsertError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: userId, // use the id passed from Signup
            gender,
            interested,
            city,
            state,
          },
          { onConflict: "id" }
        );

      if (upsertError) {
        console.error(upsertError);
        setError(upsertError.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      onComplete();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <section className="form-card">
      <button type="button" className="back-link" onClick={onBack}>
        ← Back to sign up
      </button>
      <h2 className="form-title">Complete your profile</h2>
      <p className="form-description">
        Tell us who you are and who you&apos;re looking for. Only
        opposite-sex matches will be suggested for now.
      </p>

      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label htmlFor="gender">I am</label>
          <select
            id="gender"
            className="input"
            value={profileData.gender}
            onChange={(e) => onChange("gender", e.target.value)}
            required
          >
            <option value="">Select one</option>
            <option value="woman">A woman</option>
            <option value="man">A man</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="interested">Interested in</label>
          <select
            id="interested"
            className="input"
            value={profileData.interested}
            onChange={(e) => onChange("interested", e.target.value)}
            required
          >
            <option value="">Select one</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
          </select>
        </div>

        <div className="form-row-two">
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              id="city"
              className="input"
              type="text"
              value={profileData.city}
              onChange={(e) => onChange("city", e.target.value)}
              placeholder="Los Angeles"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="state">State</label>
            <input
              id="state"
              className="input"
              type="text"
              value={profileData.state}
              onChange={(e) => onChange("state", e.target.value)}
              placeholder="CA"
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary form-primary"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save profile"}
          </button>
        </div>
      </form>
    </section>
  );
}

/* SUCCESS SCREEN */
function SuccessScreen({ signupData, profileData, onGoHome }) {
  const firstName = signupData.name.split(" ")[0] || "There";

  return (
    <section className="form-card">
      <h2 className="form-title">
        Welcome to OnlyPansas, {firstName}! 🎉
      </h2>
      <p className="form-description">
        We&apos;ve saved your info in this session. Once you hook this
        up to a backend, this is where we&apos;ll start matching you
        with people who love your vibe and your curves.
      </p>

      <div className="summary-box">
        <p>
          <strong>Location:</strong>{" "}
          {profileData.city || "Your city"},{" "}
          {profileData.state || "Your state"}
        </p>
        <p>
          <strong>You are:</strong>{" "}
          {profileData.gender || "—"} &nbsp;·&nbsp;
          <strong>Interested in:</strong>{" "}
          {profileData.interested || "—"}
        </p>
      </div>

      <button
        type="button"
        className="btn btn-primary form-primary"
        onClick={onGoHome}
      >
        Back to home
      </button>

      <p className="form-footnote">
        Next step (for a real app): connect these screens to a backend
        like Supabase to create accounts, store profiles, and start
        matching.
      </p>
    </section>
  );
}

export default App;

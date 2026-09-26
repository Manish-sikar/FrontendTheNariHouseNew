import { Link } from "react-router-dom";
import { GetBillingDetailsData } from "../services/billingService";
import { useEffect, useState } from "react";
import { baseURL } from "../services/apiService";

const Billing = () => {

  const [billingData, setBillingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      const response = await GetBillingDetailsData();
      if (response.billing_Data && response.billing_Data.length > 0) {
        setBillingData(response.billing_Data[0]);
      }
    } catch (error) {
      console.error("Error fetching billing details: ", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner if preferred.
  }



  return (
    <>
      {/* <!-- Page Header Start --> */}
      <div class="container-fluid page-header py-5">
        <div class="container text-center py-5">
          <h1 class="display-2 text-white mb-4 animated slideInDown">
            Billing
          </h1>
          <nav aria-label="breadcrumb animated slideInDown">
            <ol class="breadcrumb justify-content-center mb-0">
              <li class="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li class="breadcrumb-item" aria-current="page">
                Billing
              </li>
            </ol>
          </nav>
        </div>
      </div>
      {/* <!-- Page Header End --> */}
      {/* <!-- Fact Start --> */}
      <div class="container-fluid bg-secondary py-5">
        <div class="container">
          <div class="row">
            <div class="col-lg-3 wow fadeIn" data-wow-delay=".1s">
              <div class="d-flex counter">
                <h1 class="me-3 text-primary counter-value">99</h1>
                <h5 class="text-white mt-1">
                  Success in getting happy customer
                </h5>
              </div>
            </div>
            <div class="col-lg-3 wow fadeIn" data-wow-delay=".3s">
              <div class="d-flex counter">
                <h1 class="me-3 text-primary counter-value">25</h1>
                <h5 class="text-white mt-1">
                  Thousands of successful business
                </h5>
              </div>
            </div>
            <div class="col-lg-3 wow fadeIn" data-wow-delay=".5s">
              <div class="d-flex counter">
                <h1 class="me-3 text-primary counter-value">120</h1>
                <h5 class="text-white mt-1">Total clients who love Diditaladdworldtech</h5>
              </div>
            </div>
            <div class="col-lg-3 wow fadeIn" data-wow-delay=".7s">
              <div class="d-flex counter">
                <h1 class="me-3 text-primary counter-value">5</h1>
                <h5 class="text-white mt-1">
                  Stars reviews given by satisfied clients
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Fact End --> */}

      {/* <!-- Contact Start --> */}
      <div class="container-fluid py-5 mt-5">
        <div class="container py-5">
          <div
            class="text-center mx-auto pb-5 wow fadeIn"
            data-wow-delay=".3s"
            style={{ maxWidth: "600px" }}
          >
            <h5 class="text-primary">Billing Information</h5>
      <h1 class="mb-3">Complete Your Payment</h1>
      <p class="mb-2">
        Please provide your billing details below to proceed with the payment.
        Our secure form ensures your information is safe. If you have any questions, feel free to reach out!
      </p>
          </div>
          <div className="contact-detail position-relative p-5">
            <div className="row g-5">
              <div className="col-lg-6 wow fadeIn" data-wow-delay=".3s">
                <div className="p-3 h-100 rounded contact-map">
                  {/* Display the QR code */}
                  {billingData && billingData.qrcode && (
                    <img src={`${baseURL}/${billingData.qrcode}`} className="img-fluid" alt="QR Code" />
                  )}
                </div>
              </div>
              <div className="col-lg-6 wow fadeIn" data-wow-delay=".5s">
                <h1 className="text-center">Bank Details</h1>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Account Information</h5>
                    {billingData ? (
                      <p className="card-text">
                        <strong>Bank Name:</strong> {billingData.bank_name}
                        <br />
                        <strong>Account Holder:</strong> {billingData.acccount_holder}
                        <br />
                        <strong>Account Number:</strong> {billingData.account_number}
                        <br />
                        <strong>IFSC Code:</strong> {billingData.ifsc_code}
                        <br />
                        <strong>Branch:</strong> {billingData.branch_name}
                        <br />
                      </p>
                    ) : (
                      <p className="card-text">No billing information available.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Contact End --> */}

      {/* <!-- Back to Top --> */}
      <button
        className="btn btn-secondary btn-square rounded-circle back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <i className="fa fa-arrow-up text-white"></i>
      </button>
    </>
  );
};

export default Billing;

 
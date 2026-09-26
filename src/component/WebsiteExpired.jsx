import React from "react";

export default function WebsiteExpired() {
  return (
    <>
      <style>{`
        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
          font-family:Arial,Helvetica,sans-serif;
        }

        body{
          background:#f4f6f9;
        }

        .expired-wrapper{
          min-height:100vh;
          display:flex;
          justify-content:center;
          align-items:center;
          padding:20px;
          background:#f4f6f9;
        }

        .expired-box{
          width:100%;
          max-width:700px;
          background:#fff;
          border:1px solid #ddd;
          border-radius:8px;
          padding:50px;
          text-align:center;
          box-shadow:0 5px 20px rgba(0,0,0,.08);
        }

        .expired-icon{
          font-size:70px;
          color:#d9534f;
          margin-bottom:20px;
        }

        h1{
          color:#d9534f;
          font-size:34px;
          margin-bottom:15px;
        }

        h3{
          color:#444;
          margin-bottom:25px;
        }

        p{
          color:#666;
          font-size:17px;
          line-height:30px;
          margin-bottom:15px;
        }

        .alert-box{
          background:#fff8e5;
          border:1px solid #ffe08a;
          border-left:5px solid #f0ad4e;
          color:#8a6d3b;
          padding:18px;
          margin:30px 0;
          text-align:left;
          border-radius:5px;
        }

        .renew-btn{
          display:inline-block;
          margin-top:20px;
          padding:14px 35px;
          background:#007bff;
          color:#fff;
          text-decoration:none;
          border-radius:5px;
          font-size:18px;
          transition:.3s;
        }

        .renew-btn:hover{
          background:#0056b3;
        }

        .footer{
          margin-top:35px;
          color:#777;
          font-size:14px;
        }

        @media(max-width:768px){

          .expired-box{
            padding:30px 20px;
          }

          h1{
            font-size:28px;
          }

          p{
            font-size:16px;
          }

        }
      `}</style>

      <div className="expired-wrapper">
        <div className="expired-box">

          <div className="expired-icon">
            ⚠
          </div>

          <h1>Account Suspended</h1>

          <h3>Domain & Hosting Expired</h3>

          <p>
            The website you are trying to access is currently unavailable.
          </p>

          <p>
            The domain registration and web hosting services have expired or are
            temporarily suspended.
          </p>

          <div className="alert-box">
            <strong>Reason</strong>
            <br /><br />

            • Domain registration has expired.<br />
            • Hosting service has expired.<br />
            • Website is temporarily suspended until renewal payment is completed.
          </div>

          <a href="#" className="renew-btn">
            Renew Services
          </a>

          <div className="footer">
            If you are the website owner, please contact your hosting provider
            or complete the renewal payment to restore the website.
          </div>

        </div>
      </div>
    </>
  );
}

<!DOCTYPE html>
<html>
<head>
<style>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
</style>
</head>
<body>


<p>Hello {{ $details['name'] }},<br/>
    You registered an account on PMEX, before being able to use your account you need to verify that this is your email address you verification
    <br/> code is: {{ $details['email_verification_code'] }}
    <br /> <a href="{{env('APP_URL').'verification?user='.$details['email'].'&code='.$details['email_verification_code']  }}">CLICK HERE </a>
<br /><br /><br />
    Kind Regards, K-TRADE SECURITIES LTD </p>



</body>
</html>



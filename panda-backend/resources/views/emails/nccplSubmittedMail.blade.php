{{-- <!DOCTYPE html>
<html>
<head>
    <title>User Data submitted</title>
</head>
<body>
    <h1>{{ $details['title'] }}</h1>
    <p>{{ $details['body'] }}</p>

    <p>Thank you</p>
</body>
</html> --}}

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


<p>New Form has been submitted for OTP Verification.</p>
<table>

  <tr>
    <td>Full Name</td>
    <td>{{ $details['name'] }}</td>

  </tr>
  <tr>
    <td>Mobile Number</td>
    <td>{{ $details['mobile'] }}</td>

  </tr>
  <tr>
    <td>CNIC</td>
    <td>{{ $details['uin'] }}</td>

  </tr>
  <tr>
    <td>Email</td>
    <td>{{ $details['email'] }}</td>

  </tr>
  <tr>
    <td>IBAN No</td>
    <td>{{ $details['iban'] }}</td>

  </tr>

</table>

<p>Thanks,</p>
<p>system generated Email</p>
</body>
</html>



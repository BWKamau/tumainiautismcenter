<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize form inputs
    $name = filter_var(trim($_POST['name']), FILTER_SANITIZE_STRING);
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $message = filter_var(trim($_POST['message']), FILTER_SANITIZE_STRING);

    // Validate inputs
    if (empty($name) || empty($email) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Please fill out all fields correctly.";
        exit;
    }

    // Email details
    $to = "info@tumainiautismcentre@adnyeri.org"; // Your email address
    $subject = "New Contact Form Submission from Tumaini Website";
    $body = "Name: $name\nEmail: $email\nMessage:\n$message";
    $headers = "From: $email\r\nReply-To: $email\r\n";

    // Send email
    if (mail($to, $subject, $body, $headers)) {
        // Redirect to a thank-you page or display a success message
        echo "<h2>Thank you!</h2><p>Your message has been sent successfully.</p><a href='index.html'>Back to Home</a>";
    } else {
        echo "<h2>Error</h2><p>Sorry, there was an issue sending your message. Please try again later.</p>";
    }
} else {
    echo "Invalid request method.";
}
?>
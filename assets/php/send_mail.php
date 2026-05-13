<?php
// PHP endpoint: attempts to send via EmailJS server API first,
// falling back to PHP mail() if needed. Requires internet access from server.
// Usage: POST name, email, subject, message

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$name = strip_tags(trim($_POST['name'] ?? ''));
$email = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$subject = strip_tags(trim($_POST['subject'] ?? 'Contact message'));
$message = trim($_POST['message'] ?? '');

if (!$email) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email']);
    exit;
}

// EmailJS server API parameters — update if you change service/template/user in client
$emailjs_service = 'service_3hlmvdp';
$emailjs_template = 'template_a2ebc8a';
$emailjs_user = 'tC7H9CsmDu6d6eTpG';

$payload = json_encode([
    'service_id' => $emailjs_service,
    'template_id' => $emailjs_template,
    'user_id' => $emailjs_user,
    'template_params' => [
        'from_name' => $name,
        'from_email' => $email,
        'subject' => $subject,
        'message' => $message,
        'to_email' => 'mehtarya60@gmail.com'
    ]
]);

$ch = curl_init('https://api.emailjs.com/api/v1.0/email/send');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);

$resp = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlErr = curl_error($ch);
curl_close($ch);

if ($resp !== false && ($httpcode >= 200 && $httpcode < 300)) {
    echo json_encode(['success' => true, 'detail' => $resp]);
    exit;
}

// If EmailJS API failed, try PHP mail() as last resort
$to = 'mehtarya60@gmail.com';
$headers = "From: " . $name . " <" . $email . ">\r\n";
$headers .= "Reply-To: " . $email . "\r\n";

$body = "Name: $name\nEmail: $email\n\nMessage:\n$message";

$ok = mail($to, $subject, $body, $headers);

if ($ok) {
    echo json_encode(['success' => true, 'detail' => 'sent-via-php-mail']);
} else {
    http_response_code(500);
    $err = ['error' => 'Mail send failed', 'curl_http' => $httpcode, 'curl_err' => $curlErr, 'resp' => $resp];
    echo json_encode($err);
}

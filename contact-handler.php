<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$raw = file_get_contents('php://input') ?: '';
$data = json_decode($raw, true);
if (!is_array($data)) {
    $data = $_POST;
}

$value = static function (string $key) use ($data): string {
    $value = $data[$key] ?? '';
    return trim(is_string($value) ? $value : '');
};

$fullName = $value('fullName');
$email = $value('email');
$company = $value('company');
$country = $value('country');
$transactions = $value('transactionsPerMonth');
$message = $value('message');

if ($fullName === '' || $country === '' || $transactions === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'Please complete the required fields']);
    exit;
}

// Prevent header injection and keep the email body bounded.
foreach ([$fullName, $email, $company, $country, $transactions, $message] as $field) {
    if (preg_match('/[\r\n]/', $field) || strlen($field) > 5000) {
        http_response_code(422);
        echo json_encode(['success' => false, 'error' => 'Invalid form data']);
        exit;
    }
}

$recipient = 'Sydledgersolutions@gmail.com';
$host = preg_replace('/[^a-z0-9.-]/i', '', $_SERVER['HTTP_HOST'] ?? 'your-domain.com') ?: 'your-domain.com';
$subject = 'New SYD Ledger Solutions consultation enquiry';
$body = "Full Name: {$fullName}\n"
    . "Email: {$email}\n"
    . "Company/Business Name: " . ($company !== '' ? $company : 'Not provided') . "\n"
    . "Country: {$country}\n"
    . "Transactions per Month: {$transactions}\n"
    . "Message: " . ($message !== '' ? $message : 'Not provided') . "\n";
$headers = "From: website@{$host}\r\n"
    . "Reply-To: {$email}\r\n"
    . "X-Mailer: SYD Ledger Solutions website\r\n";

if (!mail($recipient, $subject, $body, $headers)) {
    http_response_code(502);
    echo json_encode(['success' => false, 'error' => 'Mail delivery is not available on this server']);
    exit;
}

echo json_encode(['success' => true]);


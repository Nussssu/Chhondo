<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Contact Mail</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        h2 { color: #333; }
        p { margin: 6px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h2>New Contact Message</h2>

        <p><strong>Name:</strong> {{ $data['name'] }}</p>
        <p><strong>Email:</strong> {{ $data['email'] }}</p>
        <p><strong>Subject:</strong> {{ $data['subject'] }}</p>
        <p><strong>Message:</strong></p>
        <p>{{ $data['message'] }}</p>
    </div>
</body>
</html>

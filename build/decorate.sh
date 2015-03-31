#!/bin/bash

cat <<EOF
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>$@</title>
<link rel="stylesheet" type="text/css" href="assets/style.css">
</head>
<body>
<nav>
</nav>
<main>
$(cat -)
</main>
<script src="assets/outline.js"></script>
</body>
</html>
EOF

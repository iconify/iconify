<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Plugins tests</title>
    <style>
        html, body {
            font: 16px / 24px sans-serif;
        }
        section {
            margin: 8px 0;
            border-bottom: 1px dotted #ccc;
        }
        h1 {
            font: inherit;
        }
        h1, p {
            margin: 8px 0;
            padding: 0;
        }
        svg {
            color: #08f;
        }
    </style>
</head>
<body>
<section>
    <h1>FontAwesome 4 test</h1>
    <p>SimpleSVG syntax:
        <span class="simple-svg" data-icon="fa:home"></span>
        <span class="simple-svg" data-icon="fa:home" data-flip="vertical"></span>
    </p>
    <p>Plugin syntax:
        <i class="fa fa-home"></i>
        <i class="fa fa-home fa-flip-vertical"></i>
    </p>
</section>

<section>
    <h1>FontAwesome 5 test</h1>
    <p>SimpleSVG syntax:
        <span class="simple-svg" data-icon="fa-brands:500px"></span>
        <span class="simple-svg" data-icon="fa-solid:cogs"></span>
        <span class="simple-svg" data-icon="fa-regular:futbol"></span>
        <span class="simple-svg" data-icon="fa-light:bus"></span>
    </p>
    <p>Plugin syntax:
        <i class="fab fa-500px"></i>
        <i class="fas fa-cogs"></i>
        <i class="far fa-futbol"></i>
        <i class="fal fa-bus"></i>
    </p>
</section>

<section>
    <h1>Icalicons test</h1>
    <p>SimpleSVG syntax:
        <span class="simple-svg" data-icon="il-conversation"></span>
    </p>
    <p>Plugin syntax:
        <i class="il il-conversation"></i>
    </p>
</section>

<section>
    <h1>PrestaShop test</h1>
    <p>SimpleSVG syntax:
        <span class="simple-svg" data-icon="ps-photobucket"></span>
        <span class="simple-svg" data-icon="ps-aim"></span>
    </p>
    <p>Plugin syntax:
        <i class="ps" data-ps-icon="_"></i>
        <i class="ps-icon ps-icon-aim"></i>
    </p>
</section>

<script src="./dist/simple-svg.js?<?php echo time(); ?>"></script>
<script src="./dist/plugin-fa.js?<?php echo time(); ?>"></script>
<script src="./dist/plugin-il.js?<?php echo time(); ?>"></script>
<script src="./dist/plugin-ps.js?<?php echo time(); ?>"></script>
</body>
</html>
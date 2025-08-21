<?php

use nightmare\http\request;
use function nightmare\response;

$site_title = 'vbook plugin - ' . htmlspecialchars($p['metadata']['name']);
?>
<?php require siteHeader; ?>

<?php main_title($site_title) ?>
<div class="content">
    <?= htmlspecialchars($p['metadata']['description']) ?>
</div>

<div class="content">
    <div class="layui-btn-container">
        <a class="layui-btn" href="https://vozer.vn" target="_blank">Trang chủ</a>
    </div>
</div>

<?php require siteFooter; ?>

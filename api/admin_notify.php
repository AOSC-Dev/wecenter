<?php

$notify = <<<EOF
<li><a href="http://wenda.wecenter.com/question/18106" target="_blank">WeCenter 2.5.15 发布</a></li>
EOF;

$notify = str_replace(array("\n", "\r", "\t"), '', $notify);

echo $_GET['jsoncallback'] . '({
	"notify" : "' . addslashes($notify) . '",
})';


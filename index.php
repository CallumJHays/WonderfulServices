<?php
if(file_exists('install.php'))
{
    header('Location: install.php');
}else
{
    header('Location: public/index.php');
}
?>
<script type="text/javascript">
    var API_KEY = "<?php echo $API_KEY; ?>";
</script>

<?php 
$API_KEY = getenv("API_KEY");
echo "<h2>".$API_KEY."</h2>";
echo "<script>API_KEY ='$API_KEY';</script>";
include("index.html"); 
?>


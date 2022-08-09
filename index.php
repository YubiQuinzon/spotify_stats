<script type="text/javascript">
    var API_KEY = "<?php echo $API_KEY; ?>";
</script>

<?php 
$API_KEY = getenv("API_KEY");
echo "<h2>".$API_KEY."</h2>";
include("index.html"); 
?>


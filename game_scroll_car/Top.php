<?php
require './facebooksdk/facebook.php';

// Create our Application instance (replace this with your appId and secret).
$facebook = new Facebook(array(
  'appId'  => '343511895672577',
  'secret' => 'ebf568c3d6a3cd07b5b60239b603c78c',
));

// Get User ID
$user = $facebook->getUser();

// We may or may not have this data based on whether the user is logged in.
//
// If we have a $user id here, it means we know the user is logged into
// Facebook, but we don't know if the access token is valid. An access
// token is invalid if the user logged out of Facebook.

if ($user) {
  try {
    // Proceed knowing you have a logged in user who's authenticated.
    $user_profile = $facebook->api('/me');
  } catch (FacebookApiException $e) {
    error_log($e);
    $user = null;
  }
}

// Login or logout url will be needed depending on current user state.
if ($user) {
  $logoutUrl = $facebook->getLogoutUrl();
} else {
  $loginUrl = $facebook->getLoginUrl();
}

// This call will always work since we are fetching public data.
$naitik = $facebook->api('/naitik');

if ($user): ?>
	<img src="https://graph.facebook.com/<?php echo $user; ?>/picture">
	<h2>Welcome, <strong><?php echo $user_profile[name] ?></strong></h2>
    <a href="<?php echo $logoutUrl; ?>"><h3>Logout</h3></a>
<?php 
else: ?>
    <a href="<?php echo $loginUrl; ?>"><h2>Login with Facebook</h2></a>
<?php 
endif 
?>
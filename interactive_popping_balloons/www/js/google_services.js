function toast(msg) {
  try {
    Android.showToast(msg);
  } catch(e) {
    console.log(msg);    
  }
  
}

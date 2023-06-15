#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import "RCTAppleHealthKit.h"
#import <GoogleMaps/GoogleMaps.h>
#import <RNKakaoLogins.h>
#import "RNSplashScreen.h" 
@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [GMSServices provideAPIKey:@"AIzaSyCKCM33Kcfmo-fHNylOkOSuwiVGiwtDWvY"]; // add this line using the api key obtained from Google Console

  self.moduleName = @"pacemaker";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  // RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self
  //                                           launchOptions:launchOptions];
  // /* Add Background initializer for HealthKit  */
  // [[RCTAppleHealthKit new] initializeBackgroundObservers:bridge];
  [RNSplashScreen show];  // here
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge

{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feature is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
  return true;
}

@end

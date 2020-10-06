package com.propertylistit;

import android.app.Application;
import android.content.Context;
import androidx.multidex.MultiDex;


import com.dylanvann.fastimage.FastImageViewPackage;
import com.facebook.react.ReactApplication;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker; // Import package
import io.invertase.firebase.RNFirebasePackage;

import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.kishanjvaghela.cardview.RNCardViewPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.azendoo.reactnativesnackbar.SnackbarPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.imagepicker.ImagePickerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.gettipsi.stripe.StripeReactPackage;
import com.rnfs.RNFSPackage; // <------- add package
import com.airbnb.android.react.maps.MapsPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.arttitude360.reactnative.rngoogleplaces.RNGooglePlacesPackage;
import com.devfd.RNGeocoder.RNGeocoderPackage; // <--- import
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ReactNativeDocumentPicker(),
              new RNFirebaseMessagingPackage(),
              new RNFirebaseNotificationsPackage(),
            new RNFirebasePackage(),
            new RNCWebViewPackage(),
            new RNCardViewPackage(),
            new RNDeviceInfo(),
            new SnackbarPackage(),
            new LinearGradientPackage(),
            new VectorIconsPackage(),
            new ImagePickerPackage(),
            new StripeReactPackage(),
            new RNFSPackage(),
            new MapsPackage(),
            new PickerPackage(),
            new RNGooglePlacesPackage(),
            new RNGeocoderPackage(),
            new FastImageViewPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }

}

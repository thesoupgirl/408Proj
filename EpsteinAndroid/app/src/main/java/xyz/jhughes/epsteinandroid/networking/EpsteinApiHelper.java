package xyz.jhughes.epsteinandroid.networking;

import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.converter.scalars.ScalarsConverterFactory;

public class EpsteinApiHelper {
    private static EpsteinApi epsteinApi;

    public static EpsteinApi getInstance() {
        if (epsteinApi == null) {
            OkHttpClient.Builder okHttpClient = new OkHttpClient().newBuilder()
                    .connectTimeout(60 * 5, TimeUnit.SECONDS)
                    .readTimeout(60 * 5, TimeUnit.SECONDS)
                    .writeTimeout(60 * 5, TimeUnit.SECONDS);

            Retrofit retrofit = new Retrofit.Builder()
                    .baseUrl("https://theepstein.herokuapp.com/")
                    .client(okHttpClient.build())
                    .addConverterFactory(ScalarsConverterFactory.create())
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();

            epsteinApi = retrofit.create(EpsteinApi.class);
        }

        return epsteinApi;
    }
}

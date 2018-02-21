package xyz.jhughes.epsteinandroid.activities;

import android.app.ProgressDialog;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import com.google.android.gms.auth.api.Auth;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.auth.api.signin.GoogleSignInResult;
import com.google.android.gms.common.SignInButton;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.OptionalPendingResult;
import com.google.android.gms.common.api.ResultCallback;
import com.google.android.gms.common.api.Scope;
import com.google.android.gms.tasks.Task;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import xyz.jhughes.epsteinandroid.R;
import xyz.jhughes.epsteinandroid.models.Me;
import xyz.jhughes.epsteinandroid.networking.EpsteinApiHelper;
import xyz.jhughes.epsteinandroid.utilities.SharedPrefsHelper;

public class LoginActivity extends AppCompatActivity {

    @BindView(R.id.sign_in_button)
    SignInButton signInButton;

    private GoogleSignInClient mGoogleSignInClient;
    
    private int RC_SIGN_IN = 901;

    ProgressDialog dialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        ButterKnife.bind(this);

        try {
            getSupportActionBar().hide();
        } catch (NullPointerException e) {
            // Meh...
        }

        signInButton.setSize(SignInButton.SIZE_STANDARD);

<<<<<<< HEAD
        GoogleSignInOptions signInOptions = new GoogleSignInOptions.Builder(
                GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestIdToken(getString(R.string.google_client_id))
                .requestServerAuthCode(getString(R.string.google_client_id))
=======
        GoogleSignInOptions signInOptions = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestServerAuthCode(getString(R.string.google_server_client_id))
>>>>>>> bc77222579dcfb3168817f5d80742a216c8a32d6
                .requestScopes(new Scope("https://www.googleapis.com/auth/calendar"))
                .requestScopes(new Scope("https://www.googleapis.com/auth/calendar.readonly"))
                .requestEmail()
                .build();

        mGoogleSignInClient = GoogleSignIn.getClient(this, signInOptions);
    }

    @Override
    public void onStart() {
        super.onStart();

        GoogleSignInAccount account = GoogleSignIn.getLastSignedInAccount(this);

        if (account != null
                && SharedPrefsHelper.getSharedPrefs(this).contains("idToken")
                && SharedPrefsHelper.getSharedPrefs(this).contains("email")) {
            Log.d("TAG", "Got cached sign-in");
            startActivity(new Intent(getApplicationContext(), CalendarActivity.class));
        }
    }

    @OnClick(R.id.sign_in_button)
    public void onClickSignIn() {
        Intent signInIntent =  mGoogleSignInClient.getSignInIntent();
        startActivityForResult(signInIntent, RC_SIGN_IN);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        // Result returned from launching the Intent from GoogleSignInClient.getSignInIntent(...);
        if (requestCode == RC_SIGN_IN) {
            // The Task returned from this call is always completed, no need to attach
            // a listener.
            Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
            handleSignInResult(task);
        }
    }

    private void handleSignInResult(Task<GoogleSignInAccount> completedTask) {
        try {
            GoogleSignInAccount account = completedTask.getResult(ApiException.class);

            if (account != null) {
                SharedPrefsHelper.getSharedPrefs(getApplicationContext()).edit().putString("email", account.getEmail()).apply();

<<<<<<< HEAD
                loginEpstein(account.getEmail(), account.getIdToken());
=======
                loginEpstein(account.getEmail(), account.getServerAuthCode());
>>>>>>> bc77222579dcfb3168817f5d80742a216c8a32d6
            }

        } catch (ApiException e) {
            Toast.makeText(this, "Couldn't sign in with Google", Toast.LENGTH_SHORT).show();
        }
    }
    
    private void loginEpstein(final String email, final String androidIdToken) {
<<<<<<< HEAD
=======
        dialog = ProgressDialog.show(LoginActivity.this, "", "Logging in. Please wait...", true);
        dialog.show();

>>>>>>> bc77222579dcfb3168817f5d80742a216c8a32d6
        EpsteinApiHelper.getInstance().login(androidIdToken).enqueue(new Callback<String>() {
            @Override
            public void onResponse(Call<String> call, Response<String> response) {
                if (response.code() == 202) {
<<<<<<< HEAD
                    dialog = ProgressDialog.show(LoginActivity.this, "", "Logging in. Please wait...", true);
                    dialog.show();
=======
>>>>>>> bc77222579dcfb3168817f5d80742a216c8a32d6

                    SharedPrefsHelper.getSharedPrefs(getApplicationContext()).edit().putString("idToken", response.body()).apply();

                    startActivity(new Intent(getApplicationContext(), CalendarActivity.class));
                } else {
                    Toast.makeText(getApplicationContext(), "Couldn't sign in to Epstein", Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onFailure(Call<String> call, Throwable t) {
                Toast.makeText(getApplicationContext(), "Couldn't sign in to Epstein", Toast.LENGTH_LONG).show();

<<<<<<< HEAD
                dialog.cancel();
=======
                if (dialog != null) {
                    dialog.cancel();
                }
>>>>>>> bc77222579dcfb3168817f5d80742a216c8a32d6

                t.printStackTrace();
            }
        });
    }
}

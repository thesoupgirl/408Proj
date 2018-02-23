package xyz.jhughes.epsteinandroid.activities;

import android.app.ProgressDialog;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.SignInButton;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.common.api.Scope;
import com.google.android.gms.tasks.Task;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import xyz.jhughes.epsteinandroid.R;
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

        GoogleSignInOptions signInOptions = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestServerAuthCode(getString(R.string.google_server_client_id))
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

        if (account != null) {
            Log.d("TAG", "Got cached sign-in");
            onClickSignIn();
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

                loginEpstein(account.getEmail(), account.getServerAuthCode());
            }

        } catch (ApiException e) {
            Toast.makeText(this, "Couldn't sign in with Google", Toast.LENGTH_SHORT).show();
        }
    }
    
    private void loginEpstein(final String email, final String androidIdToken) {
        dialog = ProgressDialog.show(LoginActivity.this, "", "Logging in. Please wait...", true);
        dialog.show();

        EpsteinApiHelper.getInstance().login(androidIdToken).enqueue(new Callback<String>() {
            @Override
            public void onResponse(Call<String> call, Response<String> response) {
                if (response.code() == 202) {
                    SharedPrefsHelper.getSharedPrefs(getApplicationContext()).edit().putString("idToken", response.body()).apply();

                    Intent i = new Intent(getApplicationContext(), CalendarActivity.class);
                    i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);

                    dialog.cancel();

                    startActivity(i);
                } else {
                    Toast.makeText(getApplicationContext(), "Couldn't sign in to Epstein", Toast.LENGTH_LONG).show();
                    dialog.cancel();
                }
            }

            @Override
            public void onFailure(Call<String> call, Throwable t) {
                Toast.makeText(getApplicationContext(), "Couldn't sign in to Epstein", Toast.LENGTH_LONG).show();

                if (dialog != null) {
                    dialog.cancel();
                }

                t.printStackTrace();
            }
        });
    }
}

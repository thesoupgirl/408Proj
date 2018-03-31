package xyz.jhughes.epsteinandroid.activities;

import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.Toast;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import xyz.jhughes.epsteinandroid.R;
import xyz.jhughes.epsteinandroid.models.Calendars.Calendar;
import xyz.jhughes.epsteinandroid.models.Calendars.CalendarToImport;
import xyz.jhughes.epsteinandroid.models.Calendars.Calendars;
import xyz.jhughes.epsteinandroid.networking.EpsteinApiHelper;
import xyz.jhughes.epsteinandroid.utilities.SharedPrefsHelper;

public class CalendarImportActivity extends AppCompatActivity {

    @BindView(R.id.calendar_import_listview)
    ListView listView;

    ProgressDialog dialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_calendar_import);

        ButterKnife.bind(this);

        outlookOrGoogle();
    }

    private void outlookOrGoogle() {
        AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(this)
                .setTitle("Import Calendar")
                //.setMessage("Would you like to import a Google or Outlook calendar?")
                .setCancelable(true)
                .setItems((new String[]{"Google", "Outlook"}),
                        new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int which) {
                                // The 'which' argument contains the index position
                                // of the selected item
                                switch (which) {
                                    case 0:
                                        getCalendarList();
                                        break;
                                    case 1:
                                        processOutlookWeb();
                                        break;
                                }
                            }
                        }
                ).setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        dialogInterface.dismiss();
                        finish();
                    }
                }).setOnCancelListener(new DialogInterface.OnCancelListener() {
                    @Override
                    public void onCancel(DialogInterface dialog) {
                        finish();
                    }
                });
        AlertDialog calendar = alertDialogBuilder.create();
        calendar.show();
    }

    private void processOutlookWeb() {
        showLoadingCalendarList();

        EpsteinApiHelper.getInstance().getOutlookUrl().enqueue(new Callback<String>() {
            @Override
            public void onResponse(Call<String> call, Response<String> response) {
                dialog.cancel();

                if (response.body() != null && response.code() == 200
                        && !response.body().equals("") && !response.body().startsWith("<html>")) {
                    signInToOutlookWeb(response.body());
                } else {
                    failedToGetCalendars();
                }
            }

            @Override
            public void onFailure(Call<String> call, Throwable t) {
                failedToGetCalendars();
            }
        });
    }

    public void signInToOutlookWeb(String url) {
        WebView wv = new WebView(this);
        wv.loadUrl(url);
        wv.getSettings().setJavaScriptEnabled(true);
        wv.getSettings().setDomStorageEnabled(true);
        wv.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                if (url.contains("localhost") || url.contains("heroku")) {
                    dialog.dismiss();
                    finish();
                }
            }
        });

        AlertDialog.Builder alert = new AlertDialog.Builder(this)
                .setTitle("Sign-In to Outlook")
                .setView(wv)
                .setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int id) {
                        dialog.dismiss();
                        finish();
                    }
                });
        alert.show();
    }

    private void getCalendarList() {
        showLoadingCalendarList();

        EpsteinApiHelper.getInstance().getCalendarImportList(
                SharedPrefsHelper.getSharedPrefs(this).getString("email", null),
                SharedPrefsHelper.getSharedPrefs(this).getString("idToken", null)
        ).enqueue(new Callback<Calendars>() {
            @Override
            public void onResponse(Call<Calendars> call, Response<Calendars> response) {
                dialog.dismiss();

                if (response.code() == 200 && response.body() != null) {
                    ArrayAdapter<Calendar> itemsAdapter = new ArrayAdapter<>(getBaseContext(), android.R.layout.simple_list_item_single_choice, response.body().items);
                    listView.setAdapter(itemsAdapter);
                } else {
                    failedToGetCalendars();
                }
            }

            @Override
            public void onFailure(Call<Calendars> call, Throwable t) {
                dialog.dismiss();
                failedToGetCalendars();
            }
        });
    }

    private void showLoadingCalendarList() {
        dialog = ProgressDialog.show(this, "", "Looking for calendars. Please wait...", true);
        dialog.show();
    }

    private void failedToGetCalendars() {
        Toast.makeText(getApplicationContext(), "Looks like we had a problem getting your calendars", Toast.LENGTH_LONG).show();
        setResult(CalendarActivity.FAILED_IMPORT_CALENDAR);
        finish();
    }

    @OnClick(R.id.import_calendar_button)
    public void importCalendar() {
        if (listView.getAdapter() == null || listView.getAdapter().isEmpty()) {
            Toast.makeText(this, "Looks like you don't have any other calendars", Toast.LENGTH_LONG).show();
            return;
        }
        if (listView.getCheckedItemPosition() == AdapterView.INVALID_POSITION) {
            Toast.makeText(this, "Please select a calendar", Toast.LENGTH_LONG).show();
            return;
        }

        Calendar calendar = (Calendar) listView.getItemAtPosition(listView.getCheckedItemPosition());

        EpsteinApiHelper.getInstance().importCalendar(
                new CalendarToImport(
                        calendar.id,
                        SharedPrefsHelper.getSharedPrefs(this).getString("email", null),
                        SharedPrefsHelper.getSharedPrefs(this).getString("idToken", null))
        ).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.code() == 200) {
                    setResult(CalendarActivity.IMPORTED_CALENDAR);
                    finish();
                } else {
                    Toast.makeText(getApplicationContext(), "Failed to import calendar", Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Toast.makeText(getApplicationContext(), "Failed to import calendar", Toast.LENGTH_LONG).show();
            }
        });
    }
}

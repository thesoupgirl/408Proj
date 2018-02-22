package xyz.jhughes.epsteinandroid.activities;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
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
import xyz.jhughes.epsteinandroid.models.Calendars.Calendars;
import xyz.jhughes.epsteinandroid.networking.EpsteinApiHelper;
import xyz.jhughes.epsteinandroid.utilities.SharedPrefsHelper;

public class CalendarImportActivity extends AppCompatActivity {

    @BindView(R.id.calendar_import_listview)
    ListView listView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_calendar_import);

        ButterKnife.bind(this);

        EpsteinApiHelper.getInstance().getCalendarImportList(
                SharedPrefsHelper.getSharedPrefs(this).getString("email", null),
                SharedPrefsHelper.getSharedPrefs(this).getString("idToken", null)
        ).enqueue(new Callback<Calendars>() {
            @Override
            public void onResponse(Call<Calendars> call, Response<Calendars> response) {
                if (response.code() == 202 && response.body() != null) {
                    ArrayAdapter<Calendar> itemsAdapter = new ArrayAdapter<>(getBaseContext(), android.R.layout.simple_list_item_1, response.body().items);
                    listView.setAdapter(itemsAdapter);
                } else {
                    Toast.makeText(getApplicationContext(), "Looks like we had a problem getting your calendars", Toast.LENGTH_LONG).show();
                    setResult(CalendarActivity.FAILED_IMPORT_CALENDAR);
                    finish();
                }
            }

            @Override
            public void onFailure(Call<Calendars> call, Throwable t) {
                t.printStackTrace();
                Toast.makeText(getApplicationContext(), "Looks like we had a problem getting your calendars", Toast.LENGTH_LONG).show();
                setResult(CalendarActivity.FAILED_IMPORT_CALENDAR);
                finish();
            }
        });
    }

    @OnClick(R.id.import_calendar_button)
    public void importCalendar() {
        if (listView.getAdapter() == null || listView.getAdapter().isEmpty()) {
            Toast.makeText(this, "Looks like you don't have any other calendars", Toast.LENGTH_LONG).show();
            return;
        }
        if (listView.getSelectedItem() == null) {
            Toast.makeText(this, "Please select a calendar", Toast.LENGTH_LONG).show();
            return;
        }

        Calendar calendar = (Calendar) listView.getSelectedItem();
        EpsteinApiHelper.getInstance().importCalendar(
                SharedPrefsHelper.getSharedPrefs(this).getString("email", null),
                SharedPrefsHelper.getSharedPrefs(this).getString("idToken", null),
                calendar.id
        ).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.code() == 202) {
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

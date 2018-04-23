package xyz.jhughes.epsteinandroid.adapters;

import android.content.Context;
import android.support.v7.widget.RecyclerView;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;

import xyz.jhughes.epsteinandroid.R;
import xyz.jhughes.epsteinandroid.models.Events.Event;

public class EventRatingAdapter extends RecyclerView.Adapter<EventRatingAdapter.ViewHolder> {

    private Context mContext;

    public List<Event> mDataset;

    public EventRatingAdapter(List<Event> mDataset, Context mContext) {
        this.mDataset = mDataset;
        this.mContext = mContext;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        // create a new view
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.event_rating_cardview, parent, false);
        // set the view's size, margins, paddings and layout parameters
        return new ViewHolder(v);
    }

    @Override
    public void onBindViewHolder(final ViewHolder holder, final int position) {
        holder.eventNameTextView.setText(mDataset.get(position).summary);
        holder.eventNameRatingEditText.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
                // Do Nothing
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                try {
                    mDataset.get(position).stressValue = (int) Float.parseFloat(s.toString());
                } catch (NumberFormatException e) {
                    mDataset.get(position).stressValue = 0;
                }
            }

            @Override
            public void afterTextChanged(Editable s) {
                String str = s.toString();
                int n;
                int min = -10;
                int max = 10;
                EditText ed = holder.eventNameRatingEditText;
                try {
                    if (str.equals("") || str.equals("-")) {
                        return;
                    }
                    n = Integer.parseInt(str);
                    if (n < min) {
                        ed.setText("" + min);
                        Toast.makeText(mContext, "Minimum allowed is " + min, Toast.LENGTH_SHORT).show();
                    } else if (n > max) {
                        ed.setText("" + max);
                        Toast.makeText(mContext, "Maximum allowed is " + max, Toast.LENGTH_SHORT).show();
                    }
                } catch (NumberFormatException nfe) {
                    ed.setText("" + min);
                    Toast.makeText(mContext, "Bad format for number!" + max, Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    @Override
    public int getItemCount() {
        return mDataset.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {

        @BindView(R.id.event_name)
        TextView eventNameTextView;

        @BindView(R.id.event_rating_edit_text)
        EditText eventNameRatingEditText;

        private ViewHolder(View v) {
            super(v);
            ButterKnife.bind(this, v);
        }
    }

}

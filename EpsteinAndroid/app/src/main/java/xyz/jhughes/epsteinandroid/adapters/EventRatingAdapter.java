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
    public void onBindViewHolder(ViewHolder holder, final int position) {
        holder.eventNameTextView.setText(mDataset.get(position).summary);
        holder.eventNameRatingEditText.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
                // Do Nothing
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                mDataset.get(position).stressValue = Integer.parseInt(s.toString());
            }

            @Override
            public void afterTextChanged(Editable s) {
                mDataset.get(position).stressValue = Integer.parseInt(s.toString());
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

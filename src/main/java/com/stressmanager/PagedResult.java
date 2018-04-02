package com.stressmanager;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PagedResult<T> {
  @JsonProperty("@odata.nextLink")
  private String nextPageLink;
  private T[] value;

  public String getNextPageLink() {
    return nextPageLink;
  }
  public void setNextPageLink(String nextPageLink) {
    this.nextPageLink = nextPageLink;
  }
  public T[] getValue() {
    return value;
  }
  public void setValue(T[] value) {
    this.value = value;
  }
}
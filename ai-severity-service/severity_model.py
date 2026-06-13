from sklearn.base import BaseEstimator, TransformerMixin


class TextBuilder(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        return self

    def transform(self, X):
        return (
            X["injury_type"].fillna("").astype(str) + " "
            + X["incident_description"].fillna("").astype(str) + " victims_"
            + X["victim_count"].fillna(1).astype(int).astype(str)
        ).values

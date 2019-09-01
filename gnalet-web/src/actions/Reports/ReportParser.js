export class ReportParser {
  querySnapshot = null;
  documents = [];

  constructor(qsnaps) {
    this.querySnapshot = qsnaps;
    this.mapQuerytoSnap();
  }

  mapQuerytoSnap = () => {
    this.querySnapshot.forEach(doc => {
      const data = doc.data();
      data.id = doc.id;
      this.documents.push(data);
    });
  };
}

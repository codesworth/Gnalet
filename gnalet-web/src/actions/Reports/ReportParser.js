export class ReportParser {
  querySnapshot = null;
  documents = [];

  constructor(qsnaps) {
    this.querySnapshot = qsnaps;
  }

  mapQuerytoSnap = () => {
    this.querySnapshot.forEach(doc => {
      this.documents.push(doc.data());
    });
  };
}

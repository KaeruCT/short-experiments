function Timed(waitTime, getTime) {
  this.getTime = getTime;
  this.waitTime = waitTime;
  this.lastOccurrence = this.getTime();
}
Timed.prototype.check = function () {
  return this.getTime() - this.waitTime > this.lastOccurrence;
};
Timed.prototype.set = function () {
  this.lastOccurrence = this.getTime();
};
Timed.prototype.timeLeft = function () {
  return this.lastOccurrence - this.getTime() + this.waitTime;
};

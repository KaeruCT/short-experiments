function Timed(waitTime, getTime) {
  this.lastOccurrence = 0;
  this.getTime = getTime;
  this.waitTime = waitTime;
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

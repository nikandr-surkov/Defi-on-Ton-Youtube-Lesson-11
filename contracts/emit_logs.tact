import "@stdlib/deploy";

message TransferEvent {
    amount: Int as coins;
    recipient: Address;
}

message StakeEvent {
    amount: Int as coins;
}

contract EmitLogs with Deployable {

    val: Int as int64;

    init() {
        self.val = 37483;
    }

    receive("action") {
        // Handle the "action" message
        // ...
        // Emit a log indicating that the action was handled
        emit("Action handled".asComment());
    }

    receive("transfer") {
        // Handle the "transfer" message
        // ...
        // Emit a log indicating that a transfer occurred
        emit(TransferEvent{amount: ton("1.25"), recipient: sender()}.toCell());
    }

    receive("stake") {
        // Handle the "stake" message
        // ...
        // Emit a log indicating that staking occurred
        emit(StakeEvent{amount: ton("0.007")}.toCell());
    }
}

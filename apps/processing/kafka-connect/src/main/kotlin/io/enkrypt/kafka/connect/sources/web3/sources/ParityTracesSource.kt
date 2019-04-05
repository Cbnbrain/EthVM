package io.enkrypt.kafka.connect.sources.web3.sources

import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.avro.capture.TraceListRecord
import com.ethvm.avro.capture.TraceRecord
import io.enkrypt.common.extensions.setNumberBI
import io.enkrypt.kafka.connect.utils.AvroToConnect
import io.enkrypt.kafka.connect.sources.web3.ext.JsonRpc2_0ParityExtended
import io.enkrypt.kafka.connect.sources.web3.ext.toTraceRecord
import org.apache.kafka.connect.source.SourceRecord
import org.apache.kafka.connect.source.SourceTaskContext
import org.web3j.protocol.core.DefaultBlockParameter

class ParityTracesSource(
  sourceContext: SourceTaskContext,
  parity: JsonRpc2_0ParityExtended,
  private val tracesTopic: String
) : ParityEntitySource(sourceContext, parity) {

  override val partitionKey: Map<String, Any> = mapOf("model" to "trace")

  override fun fetchRange(range: LongRange): List<SourceRecord> {

    // force into long for iteration

    val longRange = LongRange(range.start, range.endInclusive)

    return longRange
      .map { blockNumber ->

        val blockNumberBI = blockNumber.toBigInteger()
        val blockParam = DefaultBlockParameter.valueOf(blockNumberBI)

        val partitionOffset = mapOf("blockNumber" to blockNumber)

        parity.traceBlock(blockParam).sendAsync()
          .thenApply { resp ->

            val traceKeyRecord = CanonicalKeyRecord.newBuilder()
              .setNumberBI(blockNumberBI)
              .build()

            val traceRecords = resp.traces.map { trace ->
              trace.toTraceRecord(TraceRecord.newBuilder()).build()
            }

            val traceListRecord = TraceListRecord
              .newBuilder()
              .setTraces(traceRecords)
              .build()

            val traceKeySchemaAndValue = AvroToConnect.toConnectData(traceKeyRecord)
            val traceValueSchemaAndValue = AvroToConnect.toConnectData(traceListRecord)

            SourceRecord(
              partitionKey, partitionOffset, tracesTopic,
              traceKeySchemaAndValue.schema(), traceKeySchemaAndValue.value(),
              traceValueSchemaAndValue.schema(), traceValueSchemaAndValue.value()
            )
          }
      }.map { future ->
        // wait for everything to complete
        future.join()
      }
  }
}
